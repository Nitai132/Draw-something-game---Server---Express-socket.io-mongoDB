import TopScore from "../models/topScore.model";


//get the current top score from DB
const getTopScore = async () => {
    try {
        const currentTopScore = await TopScore.findOne({ topScoresDocument: true });
        return currentTopScore
    } catch (err) {
        console.log(err);
        throw err;
    };
};

//set new top score into the DB
const setTopScore = async (newBestScore: Number, userName: String) => {
    try {
        return TopScore.updateOne({ topScoresDocument: true }, { $set: { currentTopScore: newBestScore, userName: userName } })
    } catch (err) {
        console.log(err);
    };
};


module.exports = { getTopScore, setTopScore };
