import React, { useState, useImperativeHandle } from "react";
import { useNavigate, Link } from "react-router-dom";
import { QUERY_COMMENTS_ACCOUNT } from "../utils/queries";
import { useMutation, useQuery } from '@apollo/client'
import { REMOVE_COMMENT } from "../utils/mutations";

export function Dashboard() {

    //TODO, get array of comments associated with username

    const { data: data2 } = useQuery(QUERY_COMMENTS_ACCOUNT, {
        variables: {
            account: JSON.parse(localStorage.getItem('Codleid'))
        }
    });

    const [_deleteComment, { data, error }] = useMutation(REMOVE_COMMENT)

    async function deleteComment(id) {

        console.log(id);

        await _deleteComment({
            variables: {
                comment: id,
            }
        });

        window.location.reload(false);
    }

    let accComments = data2?.comments_account;

    //get array of highschores associated with username

    const [scoreArray, setScoreArray] = useState([
        { word: "test", score: 5 }
    ])

    console.log(accComments);

    if (!data2) {
        return null;
    }

    return (
        <div className="App bg-gradient-to-tl from-black to-gray-500 h-screen w-screen text-white" >

            <div className="h-[50px] w-screen text-transparent bg-clip-text bg-gradient-to-br from-[#ff8300] to-[#00d8ff] border-b-4 border-b-indigo-500 flex justify-center items-center text-4xl font-extrabold mb-4">
                Dashboard
            </div>

            <Link className='m-4' to="/play">New Game</Link>

            {scoreArray.map(
                function (highScore) {
                    return (
                        <div className='mb-4 rounded bg-gray-600 text-md md:text-2xl text-slate-300 md:py-2 p-[5px] md:flex-1 w-1/2 m-auto divide-y'>
                            <p>You got the word "{highScore.word}" in {highScore.score} attempts!</p>
                        </div>
                    )
                }
            )}

            {accComments.map(
                function (comment) {
                    return (<div className='mb-4 rounded bg-gray-600 text-md md:text-2xl text-slate-300 md:py-2 p-[5px] md:flex-1 w-1/2 m-auto divide-y'>
                        <p>{comment.content}</p>
                        <div className='text-sm'>
                            <p>commented on "{comment.word.characters}"</p>
                            <button className='rounded border-2 text-red-300' onClick={() => (deleteComment(comment._id))}>Delete Comment</button>
                        </div>

                    </div>)
                }
            )
            }
        </div >
    )

}