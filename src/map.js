import React, {useEffect, useState, useRef} from 'react'
import { MapContainer, TileLayer, Marker, LayersControl, LayerGroup } from 'react-leaflet'
import { ShoutBox } from './shoutbox'
import db from './db'
import {collection, addDoc, Timestamp, query, orderBy, onSnapshot} from 'firebase/firestore'
import Header from './header'

const { Overlay } = LayersControl;

// Render Shoutouts 
const Shoutouts = ({ myPosition }) => {
    const [shoutOuts, setShoutOuts] = useState([])
    const [readyShoutOut, setReadyShoutOut] = useState(false)   

    useEffect(() => {
        loadShoutOuts()
    },[])

    const loadShoutOuts = () => {
        const q = query(collection(db, 'shouts'))
        
        // fetchData from firebase db
        onSnapshot(q, (querySnapshot) => {
            setShoutOuts(
                querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    text: doc.data().text,
                    position: [doc.data().position[0], doc.data().position[1]],
                    myPosition: myPosition,
                    comments: doc.data().comments,
                    // comment: true,
                    editable: false
                }))
            )
            setReadyShoutOut(true)
        })
    }
            
    if ( readyShoutOut ) {
        return (
            <>
                {shoutOuts.map((shoutOut,index) => (
                    <Marker key={index} position={shoutOut.position}>
                        <ShoutBox shout={shoutOut} position={shoutOut.position}/>
                    </Marker>
                ))}
            </>
        )
    }
}

const Map = () => {
    const [position, setPosition] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [shout, setShout] = useState({})
    const myPin = useRef()
    const mapRef = useRef()
    const markerRef = useRef(null);
    
    useEffect(() => {
        loadMyPosition()
        
        setShout({
            text: '',
            editable: true,
            comments: [],
            disableComment: true
        })
    },[])

    // on map load get user geolocation
    const loadMyPosition = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords
            setPosition([latitude, longitude])
            setIsLoading(false)
        })
    }

    const triggerShoutout = () => {
        const myPinLayer = myPin.current 
        mapRef.current.flyTo(position, 18)
        mapRef.current.addLayer(myPinLayer)
        markerRef.current.openPopup()
    }

    if ( isLoading ) {
        return <div className="is-loading fade-animation">Loading...</div>
    } else {
        return(
            <>
                <Header triggerShoutout={triggerShoutout}/>
                    
                <div className="map-wrapper">
                    <MapContainer
                        center={[11.662,121.126]}
                        zoom={5}
                        max-zoom={20}
                        ref={mapRef}
                        whenCreated={ mapInstance => { mapRef = mapInstance }}
                    >
                        <Overlay>
                            <LayerGroup ref={myPin}>
                                <Marker className="test" ref={markerRef} position={position} >
                                    <ShoutBox shout={shout} position={position}/>
                                </Marker>
                            </LayerGroup>
                        </Overlay>

                        <Shoutouts myPosition={position} disableComment={true} />
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    </MapContainer>
                </div>

                <footer>Beta v0.0.1</footer>
            </>
        )
    }
}

export default Map