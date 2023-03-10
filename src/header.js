import React from 'react'

const Header = ({ triggerShoutout }) => {
    
    const handleClick = (e) => {
        e.preventDefault()
        triggerShoutout(true)
    }

    return (
        <header id="main-header">
            <a href="#/" className="shoutout-btn" onClick={handleClick}>Shoutout!</a>
        </header>
    )
}

export default Header