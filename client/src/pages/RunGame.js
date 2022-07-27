import React, { useState, useEffect, useRef } from "react";
import { useLazyQuery, useMutation } from '@apollo/client';

import Keyboard from '../components/Keyboard'
import Highscore from '../components/Highscore'
import Comments from '../components/Comments'
import AddComment from '../components/AddComment'
import RowForGuessing from '../components/RowForGuessing'
import Nav from '../components/Nav';
import { useNavigate, Link } from "react-router-dom";
import { QUERY_WORD } from "../utils/queries";
import { UPDATE_SCORE } from "../utils/mutations";


export function RunGame(props) {

    let navigate = useNavigate();

    const [queryWord, { data }] = useLazyQuery(QUERY_WORD);

    useEffect(() => {
        queryWord({
            fetchPolicy: "no-cache"
        })
    }, [])

    const commentsRef = useRef()

    function handleAddComment() {
        commentsRef.current.refetch()
    }

    console.log(data);

    const word = data?.word;

    const [gameWin, setGameWin] = useState(false);

    const [typedLetterArray, setTypedLetterArray] = useState([]);

    const [submittedRowArray, setSubmittedRowArray] = useState([]);

    const [score, setScore] = useState(1);

    const [highScore, setHighScore] = useState({ scorenum: 1, scorename: '' });

    const [updateScore, { error, data: data2 }] = useMutation(UPDATE_SCORE)

    const checkScore = async (word) => {
        let wordHighScore = word.highScore;
        let wordHighScoreName = word.highScoreName

        if (!word.highScore || word.highScore >= score) {
            try {
                await updateScore({
                    variables: {
                        word: word._id,
                        score: score,
                        username: JSON.parse(localStorage.getItem('CodleUsername'))
                    }
                })
            } catch (e) {
                console.error(e);
                return;
            } finally {
                wordHighScore = score;
                wordHighScoreName = JSON.parse(localStorage.getItem('CodleUsername'))
                setHighScore({ scorenum: wordHighScore, scorename: wordHighScoreName })

                console.log("Word has been updated, highscore: " + highScore.scorename + wordHighScoreName);
                setGameWin(true);

            }
        } else {
            setHighScore({ scorenum: wordHighScore, scorename: wordHighScoreName })

            console.log("Word has been updated, highscore: " + highScore.scorename + wordHighScoreName);
            setGameWin(true);
        }



    }

    const keyboardButtonPressed = (buttonValue) => {

        if (buttonValue === 'Delete') {

            setTypedLetterArray(typedLetterArray.slice(0, -1));

        } else if (buttonValue === 'Enter' && typedLetterArray.length === word.characters.length) {
            if (typedLetterArray.join('') === word.characters.toUpperCase()) {
                checkScore(word)
                setSubmittedRowArray(submittedRowArray.concat(typedLetterArray.join('')));
                return;
            }
            setSubmittedRowArray(submittedRowArray.concat(typedLetterArray.join('')));
            setTypedLetterArray([]);
            setScore(score + 1);

        } else if (buttonValue === 'Enter') {
            return;
        } else if (typedLetterArray.length === word.characters.length) {
            return;
        } else {
            setTypedLetterArray(typedLetterArray.concat(buttonValue.toUpperCase()))
        }

    }


    if (!word) {
        return null;
    }

    return (
        <div className='text-white bg-gradient-to-tl from-black to-gray-500 h-[100%] w-screen min-h-screen'>
            <Nav />

            {/* <Link to="/comments">View Your Comments</Link> */}
            <button className='m-4' onClick={() => { window.location.reload(false) }}>New Game</button>

            <button className='m-4' onClick={() => { navigate('/dashboard') }}>Account Dashboard</button>

            {submittedRowArray.length > 0 ? (
                submittedRowArray.map(
                    function (string, i) {
                        return <RowForGuessing word={word.characters} typedLetters={string.split('')} isSubmitted={true} />
                    }
                )
            ) :
                (
                    <div></div>
                )}



            {!gameWin ? (
                <div>
                    <RowForGuessing word={word.characters} typedLetters={typedLetterArray} isSubmitted={false} />

                    <Keyboard buttonCallback={keyboardButtonPressed} />
                </div>
            ) : (
                <div>

                    <Highscore highScore={highScore.scorenum} name={highScore.scorename} />

                    <Comments word={word} ref={commentsRef} />

                    <AddComment word={word} onAddComment={handleAddComment} />
                </div>
            )
            }
        </div >
    );
}

