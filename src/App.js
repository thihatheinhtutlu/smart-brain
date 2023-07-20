import React, { Component } from 'react';
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import './App.css';


const initialState = {
    input: '',
            imageUrl: '',
            box: {},
            route: 'signin',
            isSignedIn: false,
            user: {
                id: '' ,
                name: '' ,
                email: '' ,
                entries: 0 ,
                joined: ''


            }

        }


class App extends Component {
    constructor() {
        super();
        this.state = initialState;
    }

    loadUser = (data) => {
        this.setState({user: {
                    id: data.id ,
                    name: data.name ,
                    email: data.email ,
                    entries: data.entries ,
                    joined: data.joined
        }})
    }

  
    calculateFaceLocation = (data) => {
        const  clarifaiFace = data.response.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
           return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCrl: width - (clarifaiFace.right_col * width ),
            bottowmRow: height - (clarifaiFace.bottom_row * height )
           }
     }

     displayFaceBox = (box) => {
        this.setState({box: box})
     }

    onInputChange = (event) => {
        this.setState({input: event.target.value});
    }
  
    

    onButtonSubmit = () => {
        this.setState({imageUrl: this.state.input});
        fetch('http://localhost:3000/imageurl', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  input: this.state.input
                })
              })
        .then(response => {
            console.log('hi', response)
            if (response) {
              fetch('http://localhost:3000/image', {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  id: this.state.user.id
                })
              })
                .then(response => response.json())
                .then(response => response.json())
                .then(count => {
                  this.setState(Object.assign(this.state.user, { entries: count}))
                })
    
            }
            this.displayFaceBox(this.calculateFaceLocation(response))
          })
          .catch(err => console.log(err));

    };

    particlesInit = async engine => {
        console.log(engine);
        await loadFull(engine);
    };

    particlesLoaded = async container => {
        await console.log(container);
    };

    onRouteChange = (route) => {
        if (route === 'signout') {
            this.setState(initialState)
        } else if (route === 'home') {
            this.setState({isSignedIn: true})
        }
        this.setState({route: route});
    }

  render() {
    return (
        <div className="App">

          <Particles className='particles'
            id="tsparticles"
            init={this.particlesInit}
            loaded={this.particlesLoaded}
            options={{
                background: {
                    color: {
                        value: "#C0C0C0",
                    },
                },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onClick: {
                            enable: true,
                            mode: "push",
                        },
                        onHover: {
                            enable: true,
                            mode: "repulse",
                        },
                        resize: true,
                    },
                    modes: {
                        push: {
                            quantity: 4,
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.4,
                        },
                    },
                },
                particles: {
                    color: {
                        value: "#ffffff",
                    },
                    links: {
                        color: "#ffffff",
                        distance: 250,
                        enable: true,
                        opacity: 0.5,
                        width: 1,
                    },
                    collisions: {
                        enable: true,
                    },
                    move: {
                        directions: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 6,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 80,
                    },
                    opacity: {
                        value: 0.5,
                    },
                    shape: {
                        type: "star",
                    },
                    size: {
                        value: { min: 1, max: 5 },
                    },
                },
                detectRetina: true,
            }}
        />
        
          <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
          { this.state.route === 'home' 
            ? <div> 
                    <Logo /> 
                    <Rank />
                    <ImageLinkForm 
                        onInputChange={this.onInputChange} 
                        onButtonSubmit={this.onButtonSubmit}
                    />
                    <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} /> 
              </div> 
            : (
                this.state.route === 'signin'
               ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
               : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            )
             
            
        } 
        </div> 
    );
  }
      
}


export default App;