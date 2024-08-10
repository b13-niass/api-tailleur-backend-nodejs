import jwt from "jsonwebtoken";

import {verifyPassword, hashPassword} from "../utils/password.js";
import Compte from "../model/Compte.js";
import Tailleur from "../model/Tailleur.js";
import {createJWT} from "../utils/jwt.js";
import User from "../model/User.js";
import Client from "../model/Client.js";
import bloquer from "../model/Bloquer.js";

class AuthController {

    async login(req, res) {
        try {
            const {email, password} = req.body;

            /**
             * Faire ici la validation des champs
             */

            // Trouver l'utilisateur par e-mail
            const compte = await Compte.findOne({email});

            // return res.json(compte);

            if (!compte) {
                return res.status(404).json({message: 'Utilisateur non trouvé', status: 'KO'});
            }

            // Vérifier le mot de passe
           /*  const isMatch = await verifyPassword(password, compte.password);
            if (!isMatch) {
                return res.status(400).json({message: 'Mot de passe incorrect', status: 'KO'});
            } */

            // Génération d'un token JWT
            const token = createJWT({id: compte._id, role: compte.role});

            res.status(200).json({token, status: 'OK', message: 'Connexion réussi'});
        } catch (error) {
            res.status(500).json({message: 'Erreur lors de la connexion', error});
        }
    }

    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({message: 'La déconnection a échoué', status: 'KO'});
            }
            res.json({message: 'La déconnection a réussi', status: 'OK'});
        });
    }

    async register(req, res) {
        try {

            const {
                lastname,
                firstname,
                email,
                password,
                confirm_password,
                identifiant,
                role,
                phone,
                city,
                picture,
            } = req.body;

            /**
             * Faire ici la validation des champs
             */

            // Vérifiez si l'utilisateur existe déjà
            const existingUser = await Compte.findOne({
                $or: [
                    { email},
                    { identifiant}
                ]
            });
            if (existingUser) {
                return res.status(400).json({message: 'Email déjà utilisé', status: 'KO',});
            }

            if (password !== confirm_password){
                return res.status(400).json({message: 'Les mots de passe ne correspondent pas à la confirmation', status: 'KO'});
            }
            // Hachage du mot de passe
            const hashedPassword = await hashPassword(password);

            // Création d'un nouvel utilisateur
            const user = new User({
                lastname,
                firstname,
                phone,
                city,
                picture,
                updatedAt: new Date(),
                createdAt: new Date()
            });
            // return res.json(user);
            await user.save();

            const compte = new Compte({
                email,
                identifiant,
                role,
                password: hashedPassword,
                user_id: user._id,
                updatedAt: new Date(),
                createdAt: new Date(),
                etat: 'active'
            })
            await compte.save();

            if (role === 'tailleur'){
                const tailleur = new Tailleur({
                    compte_id: compte._id,
                    updatedAt: new Date(),
                    createdAt: new Date(),
                });
                await tailleur.save();
            }
            if (role === 'client'){
                const client = new Client({
                    compte_id: compte._id,
                    updatedAt: new Date(),
                    createdAt: new Date(),
                });
                await client.save();
            }

            res.status(201).json({message: 'L\'inscription a réussi', status: 'OK'});
        } catch (error) {
            res.status(500).json({message: 'Erreur lors de l\'inscription', status: 'KO', error});
        }
    }

    async getLoginUser(req, res) {
        try {
            return res.json(1);
            const {id} = req.params;
            // Trouver le client par ID
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({message: 'User non trouvé'});
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({message: 'Erreur lors de la récupération du user', error});
        }
    }




//bloquer utilisateur
async bloquer(req, res) {
  
    try {
        const { userIdToBlock } = req.body;  // L'ID de l'utilisateur à bloquer
         const tailleurId = req.id;  // L'ID de l'utilisateur connecté (doit être un tailleur)
            
        // Vérifier si le tailleur est connecté
        const tailleur = await Compte.findById(tailleurId).populate('role');
        if (!tailleur || tailleur.role !== 'tailleur') {
            return res.status(403).json({ message: "Accès refusé. Seuls les tailleurs peuvent bloquer des utilisateurs.", status: 'KO' });
        }

        // Vérifier si l'utilisateur à bloquer est un tailleur ou un client suivi par le tailleur
        const userToBlock = await Compte.findById(userIdToBlock);

        if (!userToBlock) {
            return res.status(404).json({ message: "Utilisateur à bloquer introuvable.", status: 'KO' });

        }

        

        // Vérifier si le tailleur suit l'utilisateur à bloquer
        const isFollowed = tailleur.follower_ids.some(followerId => followerId.toString() === userIdToBlock);
        if (!isFollowed) {
            return res.status(403).json({ message: "Vous ne pouvez bloquer que des utilisateurs que vous suivez.", status: 'KO' });
        }

        // Créer l'enregistrement de blocage
        const newBloquer = new Bloquer({
            blocker_id: tailleurId,
            blocked_id: userIdToBlock,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await newBloquer.save();

        res.status(200).json({ message: "L'utilisateur a été bloqué avec succès.", status: 'OK' });
    } catch (error) {
        console.error('Erreur lors du blocage de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur lors du blocage de l\'utilisateur', status: 'KO' });
    }
}

}


// Autres méthodes...


export default new AuthController();

// jwtwebtoken
// bcryptjs