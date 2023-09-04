import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'gsap';
import * as Tone from 'tone';

const overlay = document.querySelector('.overlay');
const cursor = document.createElement('div');
const cursorbaby = document.createElement('div');
cursor.classList.add('mouse-cursor');
document.body.appendChild(cursor);

cursorbaby.classList.add('mouse-baby');
document.body.appendChild(cursorbaby);

const cursorTriggers = document.querySelectorAll('.cursor-trigger');



cursorTriggers.forEach(trigger => {
  trigger.addEventListener('mouseover', () => {
    gsap.to(cursor, {
      width: 60, 
      height: 60, 
      duration: 0.2,
    });
    gsap.to(cursorbaby, {
        width: 60,
        height: 60, 
        duration: 0.2,
      });
  });

  trigger.addEventListener('mouseout', () => {
    gsap.to(cursor, {
      width: 40, 
      height: 40, 
      duration: 0.2,
    });
    gsap.to(cursorbaby, {
        width: 5, 
        height: 5, 
        duration: 0.2,
      });
  });
});

document.addEventListener('mousemove', (e) => {
  overlay.style.setProperty('--mouse-x', e.clientX + 'px');
  overlay.style.setProperty('--mouse-y', e.clientY + 'px');
  gsap.to(cursor, {
    top: e.clientY,
    left: e.clientX,
    duration: 0.1,
  });
  gsap.to(cursorbaby, {
    top: e.clientY,
    left: e.clientX,
    duration: 0.01,
  });
});


window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen');
  const loadingBar = loadingScreen.querySelector('.loading-bar');
  const counter = loadingScreen.querySelector('.counter');
  const overlay = document.querySelector('.overlay');
  const popupmusic = document.querySelector('.popup');
  const buttonyes = document.getElementById('yes-button');
  const buttonno = document.getElementById('no-button');
  let popup = false;

  gsap.to(loadingBar, {
      width: '90%',
      duration: 5,
      ease: 'power2.out',
      onComplete: () => {
          overlay.style.display = 'block';
      },
  });

  gsap.to(counter, {
      innerHTML: '90%',
      duration: 5,
      ease: 'power2.out',
      onComplete: () => {
          counter.innerHTML = '90%';
              if (counter.innerHTML === "90%") { 
                  popup = true;
                  popupmusic.style.display = 'block';
                  console.log('ici');
              } 
      },
  });

  buttonyes.addEventListener('click', () => {
      popupmusic.style.display = 'none';
      Tone.start(); 
                        music.start(); 
                        musiquestop.style.display = 'flex';
                        musiquecheck.style.display = 'none';
      
      gsap.to(loadingBar, {
          width: '90%',
          duration: 2,
          ease: 'power2.out',
          onComplete: () => {
              overlay.style.display = 'block';
          },
      });

      gsap.to(counter, {
          innerHTML: '100%',
          duration: 2,
          ease: 'power2.out',
          onComplete: () => {
              gsap.to(loadingScreen, {
                  opacity: 0,
                  duration: 1.5,
                  onComplete: () => {
                      loadingScreen.remove();
                      
                  },
              });
          },
      });

  });

  buttonno.addEventListener('click', () => {
    popupmusic.style.display = 'none';
    music.stop(); 
            musiquecheck.style.display = 'flex';
            musiquestop.style.display = 'none';

    
    gsap.to(loadingBar, {
        width: '90%',
        duration: 5,
        ease: 'power2.out',
        onComplete: () => {
            overlay.style.display = 'block';
        },
    });

    gsap.to(counter, {
        innerHTML: '100%',
        duration: 5,
        ease: 'power2.out',
        onComplete: () => {
            gsap.to(loadingScreen, {
                opacity: 0,
                duration: 1.5,
                onComplete: () => {
                    loadingScreen.remove();
                },
            });
        },
    });

  });
});


const musiquecheck = document.getElementById('playmusic');
const musiquestop = document.getElementById('stopmusic');

const container = document.getElementById('container3d');


const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
        vNormal = normal;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform vec3 uBaseColor; 
    uniform vec3 uWaveColor; 
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
        vec3 lightDir = normalize(vec3(20.0, 20.0, 20.0));
        float intensity = dot(vNormal, lightDir);

        // Couleur de base
        vec3 baseColor = uBaseColor;

        // Couleur des vagues
        vec3 waveColor = mix(vec3(20.0, 20.0, 20.0), uWaveColor, intensity);

        // Calcul de la couleur finale en fonction de l'intensité lumineuse et des vagues
        vec3 finalColor = mix(baseColor, waveColor, 1.0) * intensity;

        // Calcul de la couleur émissive (glow)
        vec3 emissiveColor = finalColor * 0.9;

        gl_FragColor = vec4(finalColor + emissiveColor, 1.0);
    }
`;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);



const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 40, 0);
controls.minDistance = 40;
controls.maxDistance = 40;
controls.update();

const analyser = new Tone.Analyser('waveform', 1024);


const loader = new GLTFLoader();
let model;

loader.load('./model.glb', (gltf) => {
    model = gltf.scene;
    model.position.set(20, 5, 5);
    model.scale.set(120, 120, 120);
    model.receiveShadow = true;
    model.rotateZ(0);
    model.rotateY(0);
    model.rotateX(-90);
    model.castShadow = true;

    scene.add(model);

});


let sculpture;

loader.load('./sculpture.glb', (gltf) => {
    sculpture = gltf.scene;
    sculpture.position.set(35, -4.3, 38.8);
    sculpture.scale.set(1, 1, 1);
    sculpture.receiveShadow = true;
    sculpture.rotateZ(0);
    sculpture.rotateY(0);
    sculpture.rotateX(-90);
    sculpture.castShadow = true;

    scene.add(sculpture);

});


const material = new THREE.ShaderMaterial({
    uniforms: {
        waveIntensity: { value: 0.0 }, // Ajoutez cet uniforme
        uBaseColor: { value: new THREE.Vector3(0.0, 0.0, 0.2) },
        uWaveColor: { value: new THREE.Vector3(0.0, 0.0, 1.0) }
    },
    vertexShader,
    fragmentShader
});


const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.position.set(0, 80, 0);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 10;
directionalLight.shadow.mapSize.height = 10;
directionalLight.shadow.camera.near = 40;
directionalLight.shadow.camera.far = 200;
scene.add(directionalLight);





















const targetObject = new THREE.Object3D();
scene.add(targetObject);
directionalLight.target = targetObject;


const lightMoveDuration = 1; 
const lightPosition = new THREE.Vector3(1, 1, 1);

function onMouseMove(event) {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    const mouseDirection = new THREE.Vector3(mouseX, mouseY, 0.5);
    mouseDirection.unproject(camera).sub(camera.position).normalize();

    const newLightPosition = camera.position.clone().add(mouseDirection.multiplyScalar(lightPosition.distanceTo(camera.position)));

    gsap.to(lightPosition, {
        x: newLightPosition.x,
        y: newLightPosition.y,
        z: newLightPosition.z,
        duration: lightMoveDuration,
        onUpdate: () => {
            directionalLight.position.copy(lightPosition);
        }
    });
}

const particles = new THREE.Group(); 
scene.add(particles);


const particleGeometry = new THREE.BufferGeometry();
const particleMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 0.05,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: true,
});


const particlePositions = new Float32Array(60 * 3);

for (let i = 0; i < particlePositions.length; i++) {
    particlePositions[i] = (Math.random() - 0.5) * 80;
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
particles.add(particleSystem);

function animateParticles() {
    const time = performance.now() * 0.001;

    const particlePositions = particleGeometry.attributes.position.array;
    const particleCount = particlePositions.length / 3;

    for (let i = 0; i < particleCount; i++) {
        const index = i * 3;
        if (Math.random() > 0.995) {
            const startX = particlePositions[index];
            const startY = particlePositions[index + 1];
            const startZ = particlePositions[index + 2];

            const targetX = (Math.random() - 0.5) * 80;
            const targetY = (Math.random() - 0.5) * 80;
            const targetZ = (Math.random() - 0.5) * 80;

            gsap.to(particlePositions, {
                duration: 5,
                ease: 'power2.out',
                onUpdate: () => {
                    particlePositions[index] = gsap.utils.interpolate(startX, targetX, gsap.utils.wrap(time * 0.1, 0, 1));
                    particlePositions[index + 1] = gsap.utils.interpolate(startY, targetY, gsap.utils.wrap(time * 0.1, 0, 1));
                    particlePositions[index + 2] = gsap.utils.interpolate(startZ, targetZ, gsap.utils.wrap(time * 0.1, 0, 1));
                },
            });
        }
    }

    particleGeometry.attributes.position.needsUpdate = true;
}


const music = new Tone.Player('afterDark.mp3').toDestination();
music.autostart = false; 


musiquecheck.addEventListener("click", () => {
    Tone.start(); 
    music.start(); 
    musiquestop.style.display = 'flex';
    musiquecheck.style.display = 'none';
});

musiquestop.addEventListener("click", () => {
    music.stop(); 
    musiquecheck.style.display = 'flex';
    musiquestop.style.display = 'none';
});

let isMouseOverModel = false;

let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

document.addEventListener('mousemove', onMouseMove);

var IsActiveMneu = 'canva1';

const canva1 = document.getElementById("canva1"); 
const canva2 = document.getElementById("canva2"); 
const canva2work = document.getElementById("canva2work");
const canva3about = document.getElementById("canva3about");
const canva3img = document.getElementById("canva3img");
const canva4contact = document.getElementById("canva4contact");

const projectLink = document.getElementById("project");
const projectLinktel = document.getElementById("projecttel");
let animationInProgress = false;

projectLinktel.addEventListener("click", () => {
    if (animationInProgress) return; 
    animationInProgress = true; 

    canva1.style.backgroundColor = 'transparent';
    canva2.style.backgroundColor = 'transparent';
    canva2work.style.backgroundColor = 'transparent';
    canva3about.style.backgroundColor = 'transparent';
    canva4contact.style.backgroundColor = 'transparent';
    canva3img.style.backgroundColor = 'transparent';

    gsap.to(camera.position, {
        y: 0, 
        z: 40,
        x: 40,
        duration: 2, 
        ease: 'power3.inOut', 
        onComplete: () => {
            animationInProgress = false; 
        }
    });

    if(IsActiveMneu === "canva1"){
        gsap.to(canva1.style, { 
            left: "-140%", 
            duration: 1.8, 
            ease: 'power3.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
                IsActiveMneu = "canva2"
                gsap.to(canva2.style, { 
                    right: "4%", 
                    duration: 0.5, 
                    ease: 'power2.inOut', 
                    onComplete: () => {
                        console.log(IsActiveMneu)
                        animationInProgressAccueil = false; 
                    }
                });
                gsap.to(canva2work.style, { 
                    left: "10%", 
                    right: "10%", 
                    duration: 0.7, 
                    ease: 'power2.inOut', 
                    onComplete: () => {
                        animationInProgressAccueil = false; 
                    }
                });
            }
        });
    } else if(IsActiveMneu === "canva3about"){
        gsap.to(canva3about.style, { 
            left: "-100%", 
            duration: 2, 
            ease: 'power2.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
                IsActiveMneu = "canva2"
                gsap.to(canva2.style, { 
                    right: "4%", 
                    duration: 0.5, 
                    ease: 'power2.inOut', 
                    onComplete: () => {
                        console.log(IsActiveMneu)
                        animationInProgressAccueil = false; 
                    }
                });
                gsap.to(canva2work.style, { 
                    left: "10%", 
                    right: "10%", 
                    duration: 0.7, 
                    ease: 'power2.inOut', 
                    onComplete: () => {
                        animationInProgressAccueil = false; 
                    }
                });
            }
        });
        gsap.to(canva3img.style, { 
            right: "-100%", 
            duration: 2, 
            ease: 'power2.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
            }
        });
    }else if(IsActiveMneu === "canva4contact"){
        gsap.to(canva4contact.style, { 
            left: "-141%", 
            duration:1.8, 
            ease: 'power2.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
                IsActiveMneu = "canva2"
                gsap.to(canva2.style, { 
                    right: "4%", 
                    duration: 0.5, 
                    ease: 'power2.inOut', 
                    onComplete: () => {
                        console.log(IsActiveMneu)
                        animationInProgressAccueil = false; 
                    }
                });
                gsap.to(canva2work.style, { 
                    left: "10%", 
                    right: "10%", 
                    duration: 0.7, 
                    ease: 'power2.inOut', 
                    onComplete: () => {
                        animationInProgressAccueil = false; 
                    }
                });
            }
        });
    }
    gsap.to(camera.rotation, {
        _y: 90, 
        duration: 2, 
        ease: 'power3.inOut', 
        onComplete: () => {
            animationInProgress = false; 
        }
    });
});



projectLink.addEventListener("click", () => {
    if (animationInProgress) return; 
    animationInProgress = true; 

    canva1.style.backgroundColor = 'transparent';
    canva2.style.backgroundColor = 'transparent';
    canva2work.style.backgroundColor = 'transparent';
    canva3about.style.backgroundColor = 'transparent';
    canva4contact.style.backgroundColor = 'transparent';
    canva3img.style.backgroundColor = 'transparent';

    gsap.to(camera.position, {
        y: 0, 
        z: 40,
        x: 40,
        duration: 2, 
        ease: 'power3.inOut', 
        onComplete: () => {
            animationInProgress = false; 
        }
    });

    if(IsActiveMneu === "canva1"){
        gsap.to(canva1.style, { 
            left: "-140%", 
            duration: 1.8, 
            ease: 'power3.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
                IsActiveMneu = "canva2"
                gsap.to(canva2.style, { 
                    right: "4%", 
                    duration: 0.5, 
                    ease: 'power2.inOut', 
                    onComplete: () => {
                        console.log(IsActiveMneu)
                        animationInProgressAccueil = false; 
                    }
                });
                gsap.to(canva2work.style, { 
                    left: "10%", 
                    right: "10%", 
                    duration: 0.7, 
                    ease: 'power2.inOut', 
                    onComplete: () => {
                        animationInProgressAccueil = false; 
                    }
                });
            }
        });
    } else if(IsActiveMneu === "canva3about"){
        gsap.to(canva3about.style, { 
            left: "-100%", 
            duration: 2, 
            ease: 'power2.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
                IsActiveMneu = "canva2"
                gsap.to(canva2.style, { 
                    right: "4%", 
                    duration: 0.5, 
                    ease: 'power2.inOut', 
                    onComplete: () => {
                        console.log(IsActiveMneu)
                        animationInProgressAccueil = false; 
                    }
                });
                gsap.to(canva2work.style, { 
                    left: "10%", 
                    right: "10%", 
                    duration: 0.7, 
                    ease: 'power2.inOut', 
                    onComplete: () => {
                        animationInProgressAccueil = false; 
                    }
                });
            }
        });
        gsap.to(canva3img.style, { 
            right: "-100%", 
            duration: 2, 
            ease: 'power2.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
            }
        });
    }else if(IsActiveMneu === "canva4contact"){
        gsap.to(canva4contact.style, { 
            left: "-141%", 
            duration:1.8, 
            ease: 'power2.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
                IsActiveMneu = "canva2"
                gsap.to(canva2.style, { 
                    right: "4%", 
                    duration: 0.5, 
                    ease: 'power2.inOut', 
                    onComplete: () => {
                        console.log(IsActiveMneu)
                        animationInProgressAccueil = false; 
                    }
                });
                gsap.to(canva2work.style, { 
                    left: "10%", 
                    right: "10%", 
                    duration: 0.7, 
                    ease: 'power2.inOut', 
                    onComplete: () => {
                        animationInProgressAccueil = false; 
                    }
                });
            }
        });
    }

   



    gsap.to(camera.rotation, {
        _y: 90, 
        duration: 2, 
        ease: 'power3.inOut', 
        onComplete: () => {
            animationInProgress = false; 
        }
    });
});


const aboutLink = document.getElementById("about");
const aboutLinktel = document.getElementById("abouttel");

aboutLinktel.addEventListener("click", () => {
    if (animationInProgress) return; 
    animationInProgress = true; 

    canva1.style.backgroundColor = 'transparent';
    canva2.style.backgroundColor = 'transparent';
    canva2work.style.backgroundColor = 'transparent';
    canva3about.style.backgroundColor = 'transparent';
    canva4contact.style.backgroundColor = 'transparent';
    canva3img.style.backgroundColor = 'transparent';


    gsap.to(camera.position, {
        y: 0, 
        z: -40,
        x: -40,
        duration: 2, 
        ease: 'power3.inOut', 
        onComplete: () => {
            animationInProgress = false; 
        }
    });

    if(IsActiveMneu === "canva1"){
        gsap.to(canva1.style, { 
            left: "-140%", 
            duration: 1.8, 
            ease: 'power3.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
                IsActiveMneu = "canva3about"
                gsap.to(canva3about.style, { 
                    left: "20%",
                    right:"10%" ,
                    duration: 2, 
                    ease: 'power3.inOut', 
                    onComplete: () => {
                        animationInProgressAccueil = false; 
                    }
                })
                gsap.to(canva3img.style, { 
                    right: "4%", 
                    duration: 2, 
                    ease: 'power2.inOut', 
                    onComplete: () => {
                        animationInProgressAccueil = false; 
                    }
                });
            }
        });
    }else if(IsActiveMneu === "canva2"){
        gsap.to(canva2work.style, { 
            left: "-141%", 
            duration:1.8, 
            ease: 'power2.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
                IsActiveMneu = "canva3about"
                gsap.to(canva3about.style, { 
                    left: "20%",
                    right:"10%" ,
                    duration: 2, 
                    ease: 'power3.inOut', 
                    onComplete: () => {
                        animationInProgressAccueil = false; 
                    }
                })
                gsap.to(canva3img.style, { 
                    right: "4%", 
                    duration: 2, 
                    ease: 'power2.inOut', 
                    onComplete: () => {
                        animationInProgressAccueil = false; 
                    }
                });
            }
        });
    
        gsap.to(canva2.style, { 
            right: "-141%", 
            duration: 1.8, 
            ease: 'power2.inOut', 
        });
    }
    else if(IsActiveMneu === "canva4contact"){
        gsap.to(canva4contact.style, { 
            left: "-141%", 
            duration:1.8, 
            ease: 'power2.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
                IsActiveMneu = "canva3about"
                gsap.to(canva3about.style, { 
                    left: "20%",
                    right:"10%" ,
                    duration: 2, 
                    ease: 'power3.inOut', 
                    onComplete: () => {
                        animationInProgressAccueil = false; 
                    }
                })
                gsap.to(canva3img.style, { 
                    right: "4%", 
                    duration: 2, 
                    ease: 'power2.inOut', 
                    onComplete: () => {
                        animationInProgressAccueil = false; 
                    }
                });
            }
        });
    }

    gsap.to(camera.rotation, {
        _y: 90, 
        duration: 2, 
        ease: 'power3.inOut', 
        onComplete: () => {
            animationInProgress = false; 
        }
    });
});

aboutLink.addEventListener("click", () => {
    if (animationInProgress) return; 
    animationInProgress = true; 

    canva1.style.backgroundColor = 'transparent';
    canva2.style.backgroundColor = 'transparent';
    canva2work.style.backgroundColor = 'transparent';
    canva3about.style.backgroundColor = 'transparent';
    canva4contact.style.backgroundColor = 'transparent';
    canva3img.style.backgroundColor = 'transparent';


    gsap.to(camera.position, {
        y: 0, 
        z: -40,
        x: -40,
        duration: 2, 
        ease: 'power3.inOut', 
        onComplete: () => {
            animationInProgress = false; 
        }
    });

    if(IsActiveMneu === "canva1"){
        gsap.to(canva1.style, { 
            left: "-140%", 
            duration: 1.8, 
            ease: 'power3.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
                IsActiveMneu = "canva3about"
                gsap.to(canva3about.style, { 
                    left: "10%",
                    right:"10%" ,
                    duration: 2, 
                    ease: 'power3.inOut', 
                    onComplete: () => {
                        animationInProgressAccueil = false; 
                    }
                })
                gsap.to(canva3img.style, { 
                    right: "4%", 
                    duration: 2, 
                    ease: 'power2.inOut', 
                    onComplete: () => {
                        animationInProgressAccueil = false; 
                    }
                });
            }
        });
    }else if(IsActiveMneu === "canva2"){
        gsap.to(canva2work.style, { 
            left: "-141%", 
            duration:1.8, 
            ease: 'power2.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
                IsActiveMneu = "canva3about"
                gsap.to(canva3about.style, { 
                    left: "10%",
                    right:"10%" ,
                    duration: 2, 
                    ease: 'power3.inOut', 
                    onComplete: () => {
                        animationInProgressAccueil = false; 
                    }
                })
                gsap.to(canva3img.style, { 
                    right: "4%", 
                    duration: 2, 
                    ease: 'power2.inOut', 
                    onComplete: () => {
                        animationInProgressAccueil = false; 
                    }
                });
            }
        });
    
        gsap.to(canva2.style, { 
            right: "-141%", 
            duration: 1.8, 
            ease: 'power2.inOut', 
        });
    }
    else if(IsActiveMneu === "canva4contact"){
        gsap.to(canva4contact.style, { 
            left: "-141%", 
            duration:1.8, 
            ease: 'power2.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
                IsActiveMneu = "canva3about"
                gsap.to(canva3about.style, { 
                    left: "10%",
                    right:"10%" ,
                    duration: 2, 
                    ease: 'power3.inOut', 
                    onComplete: () => {
                        animationInProgressAccueil = false; 
                    }
                })
                gsap.to(canva3img.style, { 
                    right: "4%", 
                    duration: 2, 
                    ease: 'power2.inOut', 
                    onComplete: () => {
                        animationInProgressAccueil = false; 
                    }
                });
            }
        });
    }

    gsap.to(camera.rotation, {
        _y: 90, 
        duration: 2, 
        ease: 'power3.inOut', 
        onComplete: () => {
            animationInProgress = false; 
        }
    });
});










const ContactLink = document.getElementById("ContactLink");
const ContactLinktel = document.getElementById("ContactLinktel");

ContactLinktel.addEventListener("click", () => {
    if (animationInProgress) return; 
    animationInProgress = true; 

    canva1.style.backgroundColor = 'transparent';
    canva2.style.backgroundColor = 'transparent';
    canva2work.style.backgroundColor = 'transparent';
    canva3about.style.backgroundColor = 'transparent';
    canva4contact.style.backgroundColor = 'transparent';
    canva3img.style.backgroundColor = 'transparent';


    gsap.to(camera.position, {
        y: 0, 
        z: 80,
        x: 80,
        duration: 2, 
        ease: 'power3.inOut', 
        onComplete: () => {
            animationInProgress = false; 
        }
    });

    if(IsActiveMneu === "canva1"){
        gsap.to(canva1.style, { 
            left: "-140%", 
            duration: 1.8, 
            ease: 'power3.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
                IsActiveMneu = "canva4contact"
                gsap.to(canva4contact.style, { 
                    left: "0%", 
                    duration: 2, 
                    ease: 'power3.inOut', 
                    onComplete: () => {
                        animationInProgressAccueil = false; 
                    }
                })
            }
        });
    }else if(IsActiveMneu === "canva2"){
        gsap.to(canva2work.style, { 
            left: "-141%", 
            duration:1.8, 
            ease: 'power2.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
                IsActiveMneu = "canva4contact"
                gsap.to(canva4contact.style, { 
                    left: "0%",  
                    duration: 2, 
                    ease: 'power3.inOut', 
                    onComplete: () => {
                        animationInProgressAccueil = false; 
                    }
                })
            }
        });
    
        gsap.to(canva2.style, { 
            right: "-141%", 
            duration: 1.8, 
            ease: 'power2.inOut', 
        });
    }else if(IsActiveMneu === "canva3about"){
        gsap.to(canva3about.style, { 
            left: "-141%", 
            duration:1.8, 
            ease: 'power2.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
                IsActiveMneu = "canva4contact"
                gsap.to(canva4contact.style, { 
                    left: "0%", 
                    duration: 2, 
                    ease: 'power3.inOut', 
                    onComplete: () => {
                        animationInProgressAccueil = false; 
                    }
                })
            }
        });
    
        gsap.to(canva3img.style, { 
            right: "-100%", 
            duration: 2, 
            ease: 'power2.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
            }
        });
    }

    gsap.to(camera.rotation, {
        _y: 90, 
        duration: 2, 
        ease: 'power3.inOut', 
        onComplete: () => {
            animationInProgress = false; 
        }
    });
});


ContactLink.addEventListener("click", () => {
    if (animationInProgress) return; 
    animationInProgress = true; 

    canva1.style.backgroundColor = 'transparent';
    canva2.style.backgroundColor = 'transparent';
    canva2work.style.backgroundColor = 'transparent';
    canva3about.style.backgroundColor = 'transparent';
    canva4contact.style.backgroundColor = 'transparent';
    canva3img.style.backgroundColor = 'transparent';


    gsap.to(camera.position, {
        y: 0, 
        z: 80,
        x: 80,
        duration: 2, 
        ease: 'power3.inOut', 
        onComplete: () => {
            animationInProgress = false; 
        }
    });

    if(IsActiveMneu === "canva1"){
        gsap.to(canva1.style, { 
            left: "-140%", 
            duration: 1.8, 
            ease: 'power3.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
                IsActiveMneu = "canva4contact"
                gsap.to(canva4contact.style, { 
                    left: "0%", 
                    duration: 2, 
                    ease: 'power3.inOut', 
                    onComplete: () => {
                        animationInProgressAccueil = false; 
                    }
                })
            }
        });
    }else if(IsActiveMneu === "canva2"){
        gsap.to(canva2work.style, { 
            left: "-141%", 
            duration:1.8, 
            ease: 'power2.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
                IsActiveMneu = "canva4contact"
                gsap.to(canva4contact.style, { 
                    left: "0%",  
                    duration: 2, 
                    ease: 'power3.inOut', 
                    onComplete: () => {
                        animationInProgressAccueil = false; 
                    }
                })
            }
        });
    
        gsap.to(canva2.style, { 
            right: "-141%", 
            duration: 1.8, 
            ease: 'power2.inOut', 
        });
    }else if(IsActiveMneu === "canva3about"){
        gsap.to(canva3about.style, { 
            left: "-141%", 
            duration:1.8, 
            ease: 'power2.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
                IsActiveMneu = "canva4contact"
                gsap.to(canva4contact.style, { 
                    left: "0%", 
                    duration: 2, 
                    ease: 'power3.inOut', 
                    onComplete: () => {
                        animationInProgressAccueil = false; 
                    }
                })
            }
        });
    
        gsap.to(canva3img.style, { 
            right: "-100%", 
            duration: 2, 
            ease: 'power2.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
            }
        });
    }

    gsap.to(camera.rotation, {
        _y: 90, 
        duration: 2, 
        ease: 'power3.inOut', 
        onComplete: () => {
            animationInProgress = false; 
        }
    });
});









const accueil = document.getElementById("accueil");
const accueiltel = document.getElementById("accueiltel");

accueiltel.addEventListener("click", () => {
    if (animationInProgress) return; 
    animationInProgress = true; 
    canva1.style.backgroundColor = 'transparent';
    canva2.style.backgroundColor = 'transparent';
    canva2work.style.backgroundColor = 'transparent';
    canva4contact.style.backgroundColor = 'transparent';
    canva3img.style.backgroundColor = 'transparent';

    if(IsActiveMneu === "canva2"){
        gsap.to(canva2work.style, { 
            left: "-100%", 
            duration:2, 
            ease: 'power2.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
                IsActiveMneu = "canva1"
            }
        });
    
        gsap.to(canva2.style, { 
            right: "-100%", 
            duration: 2, 
            ease: 'power2.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
                IsActiveMneu = "canva1"
                gsap.to(canva1.style, { 
                    left: "6%", 
                    duration: 0.5, 
                    ease: 'power3.inOut', 
                });
            }
        });
    } else if(IsActiveMneu === "canva3about"){
        gsap.to(canva3about.style, { 
            left: "-100%", 
            duration: 2, 
            ease: 'power2.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
                IsActiveMneu = "canva1"
                gsap.to(canva1.style, { 
                    left: "6%", 
                    duration: 0.5, 
                    ease: 'power3.inOut', 
                });
            }
        });
        gsap.to(canva3img.style, { 
            right: "-100%", 
            duration: 2, 
            ease: 'power2.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
            }
        });
    }else if(IsActiveMneu === "canva4contact"){
        gsap.to(canva4contact.style, { 
            left: "-141%", 
            duration:1.8, 
            ease: 'power2.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
                IsActiveMneu = "canva1"
                gsap.to(canva1.style, { 
                    left: "6%", 
                    duration: 0.5, 
                    ease: 'power3.inOut', 
                });
            }
        });
    }

    gsap.to(camera.position, {
        y: 40, 
        x: 0,
        z: 0,
        duration: 2, 
        ease: 'power3.inOut', 
        onComplete: () => {
            animationInProgressAccueil = false; 
        }
    });


    gsap.to(camera.rotation, {
        _y: 0, 
        duration: 2, 
        ease: 'power3.inOut', 
        onComplete: () => {
            animationInProgress = false; 
        }
    });
});

let animationInProgressAccueil = false;

accueil.addEventListener("click", () => {
    if (animationInProgress) return; 
    animationInProgress = true; 
    canva1.style.backgroundColor = 'transparent';
    canva2.style.backgroundColor = 'transparent';
    canva2work.style.backgroundColor = 'transparent';
    canva4contact.style.backgroundColor = 'transparent';
    canva3img.style.backgroundColor = 'transparent';

    if(IsActiveMneu === "canva2"){
        gsap.to(canva2work.style, { 
            left: "-100%", 
            duration:2, 
            ease: 'power2.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
                IsActiveMneu = "canva1"
            }
        });
    
        gsap.to(canva2.style, { 
            right: "-100%", 
            duration: 2, 
            ease: 'power2.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
                IsActiveMneu = "canva1"
                gsap.to(canva1.style, { 
                    left: "6%", 
                    duration: 0.5, 
                    ease: 'power3.inOut', 
                });
            }
        });
    } else if(IsActiveMneu === "canva3about"){
        gsap.to(canva3about.style, { 
            left: "-100%", 
            duration: 2, 
            ease: 'power2.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
                IsActiveMneu = "canva1"
                gsap.to(canva1.style, { 
                    left: "6%", 
                    duration: 0.5, 
                    ease: 'power3.inOut', 
                });
            }
        });
        gsap.to(canva3img.style, { 
            right: "-100%", 
            duration: 2, 
            ease: 'power2.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
            }
        });
    }else if(IsActiveMneu === "canva4contact"){
        gsap.to(canva4contact.style, { 
            left: "-141%", 
            duration:1.8, 
            ease: 'power2.inOut', 
            onComplete: () => {
                animationInProgressAccueil = false; 
                IsActiveMneu = "canva1"
                gsap.to(canva1.style, { 
                    left: "6%", 
                    duration: 0.5, 
                    ease: 'power3.inOut', 
                });
            }
        });
    }

    gsap.to(camera.position, {
        y: 40, 
        x: 0,
        z: 0,
        duration: 2, 
        ease: 'power3.inOut', 
        onComplete: () => {
            animationInProgressAccueil = false; 
        }
    });


    gsap.to(camera.rotation, {
        _y: 0, 
        duration: 2, 
        ease: 'power3.inOut', 
        onComplete: () => {
            animationInProgress = false; 
        }
    });
});



function animate() {
    requestAnimationFrame(animate);
    animateParticles();
    if (model) {
        const modelRotationSpeed = 0.002;
        model.rotation.y += mouseX * modelRotationSpeed;
        sculpture.rotation.y += mouseX * modelRotationSpeed;
    }

    renderer.render(scene, camera); 
}


animate();


const hambugerIcon = document.querySelector('.nav-toggler')
const body = document.querySelector('html')
const navigation = document.querySelector("nav")

hambugerIcon.addEventListener("click", toggleNav)

function toggleNav(){
	hambugerIcon.classList.toggle("active")
	navigation.classList.toggle("active")
	body.classList.toggle("active")
}