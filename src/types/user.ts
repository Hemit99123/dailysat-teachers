export interface User {
    _id: string;
    name: string;
    email: string;
    image: string; // User's profile image URL
    currency: number; // User's currency balance
    wrongQuestions: number; // Number of wrong questions answered
    correctQuestions: number; // Number of correct questions answered
    correctAnswered: number; // Correct answers count
    wrongAnswered: number; // Wrong answers count
}
