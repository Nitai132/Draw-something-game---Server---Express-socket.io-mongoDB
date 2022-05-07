import TopScore from "../models/topScore.model";



const getTopScore = async () => {
    try {
        const currentTopScore = await TopScore.findOne({ topScoresDocument: true });
        return currentTopScore
    } catch (err) {
        console.log(err);
        throw err;
    };
};

const setTopScore = async (newBestScore: any, userName: any) => {
    try {
        return TopScore.updateOne({ topScoresDocument: true }, { $set: { currentTopScore: newBestScore, userName: userName } })
    } catch (err) {
        console.log(err);
    };
};


module.exports = { getTopScore, setTopScore };
