import React, {useEffect, useState} from 'react'
import { Popup } from 'react-leaflet'
import {db, uniqueID} from './db'
import {collection, setDoc, updateDoc, arrayUnion, doc, query, where, onSnapshot, Timestamp} from 'firebase/firestore'

export const ShoutForm = ({ sendTextToParent, position, shoutText }) => {
    const [text, setText] = useState('')
    const [formSubmitted, setFormSubmitted] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        
        // save text & position to database 
        const shouts = collection(db, 'shouts')

        setDoc(doc(shouts, uniqueID()), {
            text: text,
            position: position,
            comments: [],
            created: Timestamp.now()
        })
            
        sendTextToParent(text)
        setFormSubmitted(true)
    }


    if ( !formSubmitted ) {
        // render textarea and button
        return(
            <form onSubmit={handleSubmit}>
                <h4>Shoutout!</h4>
                <textarea onChange={e => setText(e.target.value)} value={text}></textarea>
                <button>submit</button>
            </form>
        )
    } else {
        // render h1
        return(
            <h1 className="shoutout-display">{text}</h1>
        )
    }
}

const CommentForm = ({ sendCommentToParent, shoutId }) => {
    const [commentText, setCommentText] = useState()
    const commentFeed = document.querySelectorAll('.comment-feed')[0]
            
    const handleSubmit = (e) => {
        e.preventDefault()
        
        if ( commentText !== '' ) {
            sendCommentToParent({
                text: commentText,
                created: Timestamp.now()
            })

            const shout = doc(db, 'shouts', shoutId)

            updateDoc(shout, {
                comments: arrayUnion({
                    text: commentText,
                    created: Timestamp.now()
                })
            })

            setCommentText('')
                
            setTimeout(function() {
                commentFeed.scrollTop = commentFeed.scrollHeight
            },500)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <textarea onChange={ e => setCommentText(e.target.value) } value={commentText}></textarea>
            <button>Comment</button>
        </form>
    )
}

export const ShoutBox = ({ shout, position }) => {
    // const [shoutOut, setShoutOut] = useState('')
    const [comments, setComments] = useState([])
    const [atBottom, setAtBottom] = useState(false)
    const commentFeed = document.querySelectorAll('.comment-feed')[0]
    
    useEffect(() => {
        setComments(shout.comments)
    },[])
    
    const handleForm = (text) => {
        // setShoutOut(text)
    }

    const handleComment = (comment) => {
        // dispaly new comment
        // setComments([...comments, comment])

        const q = query(collection(db, 'shouts'), where('position','==',position))

        onSnapshot(q, (querySnapshot) => {
            setComments(querySnapshot.docs[0].data().comments)
            commentFeed.scrollTop = commentFeed.scrollHeight
        })
    }
    
    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight

        if ( bottom ) {
            setAtBottom(true)
        } else {
            setAtBottom(false)
        }
    }

    const shoutForm = (shout.editable) ? <ShoutForm sendTextToParent={handleForm} position={position} shoutText={shout.text}/>  : <h1 className="shoutout-display">{shout.text}</h1>        
    const commentForm = (shout.text) ? <CommentForm sendCommentToParent={handleComment} shoutId={shout.id}/> : ''

    let commentSection = ''
    let commentFeed = ''

    if ( comments.length > 0 ) {
        commentFeed = 
            <div className={ (atBottom) ? 'comment-feed at-bottom' : 'comment-feed' } onScroll={handleScroll}>
                <ul>
                    {comments.map((comment, index) => (
                        <li key={index}>
                            <div className="comment-wrapper">
                                {comment.text}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
    }

    if ( shout.text ) {
        commentSection = 
            <div className="comment-section">
                <h4>Comments</h4>
                {commentFeed}
                {commentForm}
            </div>
    }

    return (
        <Popup>
            {shoutForm}
            {commentSection}
        </Popup>
    )
}

export default ShoutBox