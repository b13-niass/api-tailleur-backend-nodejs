import jwt from "jsonwebtoken";

import {verifyPassword, hashPassword} from "../utils/password.js";
import User from "../model/User.js";

class AuthController{

    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Trouver l'utilisateur par e-mail
            const user = await User.findOne({ email }).select('+password');

            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé', status: 'KO' });
            }

            // Vérifier le mot de passe
            const isMatch = await verifyPassword(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Mot de passe incorrect', status: 'KO' });
            }

            // Génération d'un token JWT
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1day' });

            res.status(200).json({ token, status: 'OK',message: 'Connexion réussi' });
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la connexion', error });
        }
    }

    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({message: 'La déconnection a échoué',status: 'KO'});
            }
            res.json({message: 'La déconnection a réussi',status: 'OK'});
        });
    }

    async register(req, res) {
        try {
            const { nom, prenom, email, password, role } = req.body;

            // Vérifiez si l'utilisateur existe déjà
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email déjà utilisé', status: 'KO', });
            }

            // Hachage du mot de passe
            const hashedPassword = await hashPassword(password);

            // Création d'un nouvel utilisateur
            const user = new User({
                nom,
                prenom,
                email,
                password: hashedPassword,
                role
            });

            await user.save();

            // Génération d'un token JWT
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1day' });

            res.status(201).json({message: 'L\'inscription a réussi',status: 'OK', token });
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de l\'inscription', status: 'KO', error });
        }
    }

    async getLoginUser(req,res){
        try {
            return res.json(1);
            const { id } = req.params;
            // Trouver le client par ID
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ message: 'User non trouvé' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la récupération du user', error });
        }
    }

    async userProfile(req, res) {
        // const user = await this.getLoginUser(req,res);
        const { id } = req.params;
        // Trouver le client par ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User non trouvé' });
        }
        return res.json({user, message:'User profile', status: 'OK'});
    }

}

export default new AuthController();

// jwtwebtoken
// bcryptjs