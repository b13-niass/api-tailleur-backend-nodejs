import mongoose from "mongoose";
import { Schema } from "mongoose";

const NoteSchema = new Schema({
    note: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    who_note_id: { type: Schema.Types.ObjectId, ref: 'Compte' },
    noted_id: { type: Schema.Types.ObjectId, ref: 'Compte' }
});



// Tableau de correspondance des étoiles
const starMapping = {
    1: '1 étoile',
    2: '2 étoiles',
    3: '3 étoiles',
    4: '4 étoiles',
    5: '5 étoiles'
};
// Méthode statique pour ajouter une note
NoteSchema.statics.addNote = async function (whoNoteId, notedId, rating) {
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        throw new Error('La note doit être un nombre compris entre 1 et 5 étoiles.');
    }

    // Conversion de la note en chaîne de caractères basée sur le tableau de correspondance
    const noteDescription = starMapping[rating] || 'Aucune étoile';

    const note = new this({
        note: noteDescription,
        who_note_id: whoNoteId,
        noted_id: notedId
    });

    await note.save();
    return note;
};


export default mongoose.model('Note', NoteSchema);