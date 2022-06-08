import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { QUERY_WORD } from '../utils/queries';
import { QUERY_WORDS } from '../utils/queries';
import { ADD_WORD } from '../utils/mutations';

const Word = () => {
    const wordToGuess = useQuery(QUERY_WORD);

    const [addWord, { error }] = useMutation(ADD_WORD);

    const addNewWord = async (newWord) => {
        try{
            await addWord({
                variables: {content: newWord},
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (wordToGuess, addNewWord);
};

export default Word;