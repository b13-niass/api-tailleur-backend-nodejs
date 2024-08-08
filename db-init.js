// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('monprojet-tailleur');

// Drop collections if they exist
db.clients.drop();
db.favorites.drop();
db.tailleurs.drop();
db.measures.drop();
db.comptes.drop();
db.posts.drop();
db.statuss.drop();
db.followClients.drop();
db.comments.drop();
db.commentResponses.drop();
db.likes.drop();
db.messages.drop();
db.notes.drop();
db.notifications.drop();
db.reports.drop();
db.users.drop();


// Create Collections
db.createCollection("clients");
db.createCollection("favorites");
db.createCollection("tailleurs");
db.createCollection("measures");
db.createCollection("comptes");
db.createCollection("posts");
db.createCollection("statuss");
db.createCollection("followClients");
db.createCollection("comments");
db.createCollection("commentResponses");
db.createCollection("likes");
db.createCollection("messages");
db.createCollection("notes");
db.createCollection("notifications");
db.createCollection("reports");
db.createCollection("users");

// Insert Sample Users
var userId1 = ObjectId();
var userId2 = ObjectId();

db.users.insertMany([
    {
        _id: userId1,
        lastname: "Doe",
        firstname: "John",
        phone: "1234567890",
        city: "New York",
        picture: "john_doe.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: userId2,
        lastname: "Smith",
        firstname: "Jane",
        phone: "0987654321",
        city: "Los Angeles",
        picture: "jane_smith.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
    }
]);

// Insert Sample Comptes
var compteId1 = ObjectId();
var compteId2 = ObjectId();
var compteId3 = ObjectId();

db.comptes.insertMany([
    {
        _id: compteId1,
        email: "john.doe@example.com",
        password: "password123",
        etat: "active",
        role: "tailleur",
        createdAt: new Date(),
        updatedAt: new Date(),
        identifiant: "john_doe",
        bio: "Just a regular John Doe",
        user_id: userId1,
        comment_ids: [],
        favorite_ids: [],
        follower_ids: [],
        report_ids: [],
        note_ids: []
    },
    {
        _id: compteId2,
        email: "jane.smith@example.com",
        password: "password321",
        etat: "active",
        role: "tailleur",
        createdAt: new Date(),
        updatedAt: new Date(),
        identifiant: "jane_smith",
        bio: "Jane Smith here!",
        user_id: userId2,
        comment_ids: [],
        favorite_ids: [],
        follower_ids: [],
        report_ids: [],
        note_ids: []
    },
    {
        _id: compteId3,
        email: "client@example.com",
        password: "password456",
        etat: "active",
        role: "client",
        createdAt: new Date(),
        updatedAt: new Date(),
        identifiant: "client_user",
        bio: "A sample client",
        user_id: userId1,
        comment_ids: [],
        favorite_ids: [],
        follower_ids: [],
        report_ids: [],
        note_ids: []
    }
]);

// Insert Sample Tailleurs
var tailleurId1 = ObjectId();
var tailleurId2 = ObjectId();

db.tailleurs.insertMany([
    {
        _id: tailleurId1,
        compte_id: compteId1,
        status_ids: [],
        post_ids: []
    },
    {
        _id: tailleurId2,
        compte_id: compteId2,
        status_ids: [],
        post_ids: []
    }
]);

// Insert Sample Clients
var clientId1 = ObjectId();

db.clients.insertMany([
    {
        _id: clientId1,
        compte_id: compteId3,
        measure_ids: [],
        followClient_ids: []
    }
]);

// Insert Sample Measures
var measureId1 = ObjectId();
var measureId2 = ObjectId();

db.measures.insertMany([
    {
        _id: measureId1,
        texte: "Measurement 1",
        createdAt: new Date(),
        updatedAt: new Date(),
        client_id: clientId1
    },
    {
        _id: measureId2,
        texte: "Measurement 2",
        createdAt: new Date(),
        updatedAt: new Date(),
        client_id: clientId1
    }
]);

// Update Clients with Measure References
db.clients.updateOne(
    { _id: clientId1 },
    { $set: { measure_ids: [measureId1, measureId2] } }
);

// Insert Sample Posts
var postId1 = ObjectId();
var postId2 = ObjectId();

db.posts.insertMany([
    {
        _id: postId1,
        content: "This is John's first post",
        title: "Hello World",
        image: ["image1.jpg"],
        createdAt: new Date(),
        updatedAt: new Date(),
        shareNb: 10,
        viewsNb: 100,
        author_id: compteId1,
        comment_ids: [],
        like_ids: []
    },
    {
        _id: postId2,
        content: "This is Jane's first post",
        title: "Greetings",
        image: ["image2.jpg"],
        createdAt: new Date(),
        updatedAt: new Date(),
        shareNb: 20,
        viewsNb: 200,
        author_id: compteId2,
        comment_ids: [],
        like_ids: []
    }
]);

// Insert Sample Statuss
var statusId1 = ObjectId();
var statusId2 = ObjectId();

db.statuss.insertMany([
    {
        _id: statusId1,
        files: "status1.jpg",
        description: "First status",
        duration: 10,
        viewsNB: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
        categories: "image",
        tailleur_id: compteId1
    },
    {
        _id: statusId2,
        files: "status2.jpg",
        description: "Second status",
        duration: 20,
        viewsNB: 200,
        createdAt: new Date(),
        updatedAt: new Date(),
        categories: "image",
        tailleur_id: compteId2
    }
]);

// Update Tailleurs with Status and Post References
db.tailleurs.updateMany(
    { compte_id: compteId1 },
    { $set: { status_ids: [statusId1], post_ids: [postId1] } }
);

db.tailleurs.updateMany(
    { compte_id: compteId2 },
    { $set: { status_ids: [statusId2], post_ids: [postId2] } }
);

// Insert Sample FollowClients
var followClientId1 = ObjectId();
var followClientId2 = ObjectId();

db.followClients.insertMany([
    {
        _id: followClientId1,
        client_id: clientId1,
        followed_client_id: clientId1
    },
    {
        _id: followClientId2,
        client_id: clientId1,
        followed_client_id: clientId1
    }
]);

// Insert Sample Comments
var commentId1 = ObjectId();
var commentId2 = ObjectId();

db.comments.insertMany([
    {
        _id: commentId1,
        content: "Great post!",
        createdAt: new Date(),
        updatedAt: new Date(),
        post_id: postId1,
        commentResponse_ids: []
    },
    {
        _id: commentId2,
        content: "Very informative.",
        createdAt: new Date(),
        updatedAt: new Date(),
        post_id: postId2,
        commentResponse_ids: []
    }
]);

// Insert Sample CommentResponses
var commentResponseId1 = ObjectId();
var commentResponseId2 = ObjectId();

db.commentResponses.insertMany([
    {
        _id: commentResponseId1,
        texte: "Thanks for your feedback!",
        createdAt: new Date(),
        updatedAt: new Date(),
        comment_id: commentId1
    },
    {
        _id: commentResponseId2,
        texte: "Glad you found it useful!",
        createdAt: new Date(),
        updatedAt: new Date(),
        comment_id: commentId2
    }
]);

// Insert Sample Likes
var likeId1 = ObjectId();
var likeId2 = ObjectId();

db.likes.insertMany([
    {
        _id: likeId1,
        createdAt: new Date(),
        updatedAt: new Date(),
        post_id: postId1,
        compte_id: compteId1,
        etat: "liked"
    },
    {
        _id: likeId2,
        createdAt: new Date(),
        updatedAt: new Date(),
        post_id: postId2,
        compte_id: compteId2,
        etat: "liked"
    }
]);

// Insert Sample Messages
var messageId1 = ObjectId();
var messageId2 = ObjectId();

db.messages.insertMany([
    {
        _id: messageId1,
        texte: "Hello John!",
        createdAt: new Date(),
        updatedAt: new Date(),
        sender_id: compteId1,
        receiver_id: compteId2
    },
    {
        _id: messageId2,
        texte: "Hi Jane, how are you?",
        createdAt: new Date(),
        updatedAt: new Date(),
        sender_id: compteId2,
        receiver_id: compteId1
    }
]);

// Insert Sample Notes
var noteId1 = ObjectId();
var noteId2 = ObjectId();

db.notes.insertMany([
    {
        _id: noteId1,
        note: "Great performance!",
        createdAt: new Date(),
        updatedAt: new Date(),
        user_id: compteId1,
        user_note_id: compteId2
    },
    {
        _id: noteId2,
        note: "Needs improvement.",
        createdAt: new Date(),
        updatedAt: new Date(),
        user_id: compteId2,
        user_note_id: compteId1
    }
]);

// Insert Sample Notifications
var notificationId1 = ObjectId();
var notificationId2 = ObjectId();

db.notifications.insertMany([
    {
        _id: notificationId1,
        content: "You have a new follower!",
        createdAt: new Date(),
        updatedAt: new Date(),
        post_id: postId1
    },
    {
        _id: notificationId2,
        content: "Your post received a like!",
        createdAt: new Date(),
        updatedAt: new Date(),
        post_id: postId2
    }
]);

// Insert Sample Reports
var reportId1 = ObjectId();
var reportId2 = ObjectId();

db.reports.insertMany([
    {
        _id: reportId1,
        motif: "Inappropriate content",
        createdAt: new Date(),
        updatedAt: new Date(),
        report_id: compteId1,
        reporter_id: compteId2
    },
    {
        _id: reportId2,
        motif: "Spam",
        createdAt: new Date(),
        updatedAt: new Date(),
        report_id: compteId2,
        reporter_id: compteId1
    }
]);

// Insert Sample Favorites
var favoriteId1 = ObjectId();
var favoriteId2 = ObjectId();

db.favorites.insertMany([
    {
        _id: favoriteId1,
        createdAt: new Date(),
        updatedAt: new Date(),
        compte_id: compteId1,
        post_id: postId1
    },
    {
        _id: favoriteId2,
        createdAt: new Date(),
        updatedAt: new Date(),
        compte_id: compteId2,
        post_id: postId2
    }
]);

// Update Comptes with Favorite References
db.comptes.updateOne(
    { _id: compteId1 },
    { $set: { favorite_ids: [favoriteId1] } }
);

db.comptes.updateOne(
    { _id: compteId2 },
    { $set: { favorite_ids: [favoriteId2] } }
);
