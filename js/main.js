var scene,renderer,camera,cameraControl
let gui
var spaceShipObj



// 粒子系統
const particleCount = 20000
let points

// 建立粒子系統
function createPoints(){
    const geometry = new THREE.Geometry()
    const texture = new THREE.TextureLoader().load('./img/StarM.png')
    let material = new THREE.PointsMaterial({
        size: 6,
        map: texture,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        opacity: 0.8
    })
    const range = 800
    for(let i =0 ; i < particleCount; i++) {
        const x = THREE.Math.randInt(-range,range)
        const y = THREE.Math.randInt(-range,range)
        const z = THREE.Math.randInt(-range,range)
        const point = new THREE.Vector3(x,y,z)
        geometry.vertices.push(point)
    }
    points = new THREE.Points(geometry,material)
    scene.add(points)
}

class SpaceShip {
    constructor(){
        // 飛船身體
        const spaceBody = new THREE.CylinderGeometry(60,80,60,6)
        const spacehead = new THREE.SphereGeometry(45,45,100)
        const spaceWing = new THREE.BoxGeometry(70,10,60)
        const lightBubble = new THREE.SphereGeometry(7,7,20)
        const wingSide = new THREE.CylinderGeometry(8,8,75,6)
        const engine = new THREE.CylinderGeometry(12,6,30,6)
        const engineFrame = new THREE.CylinderGeometry(15,9,20,6)
        const bottom = new THREE.CylinderGeometry(80,0,35,6)
        const shipUI = new THREE.BoxGeometry(30,15,5)

        // 材質
        const Material = new THREE.MeshNormalMaterial({color:"rgb(255, 255, 255)"})
        const headMaterial = new THREE.MeshLambertMaterial({
            color:"rgb(150, 150, 150)",
            transparent:true,
            opacity:0.5
        })
        const BodyMaterial = new THREE.MeshPhongMaterial({color:"rgb(255,255,220)"})
        const bottomMaterial = new THREE.MeshLambertMaterial({color:"rgb(100,0,100)"})
        this.body = new THREE.Mesh(spaceBody,BodyMaterial)
        this.body.position.set(0,0,0)
        this.bodyBottom = new THREE.Mesh(bottom,bottomMaterial)
        this.bodyBottom.position.set(0,-47.5,0)
        this.head = new THREE.Mesh(spacehead,headMaterial)
        this.head.position.set(0,20,0)
        this.wingLeft = new THREE.Mesh(spaceWing,Material)
        this.wingLeft.position.set(-60,0,0)
        this.wingLeft.rotation.set(0.2,-0.2,0)
        this.wingRight = this.wingLeft.clone()
        this.wingRight.position.set(60,0,0)
        this.wingRight.rotation.set(0.2,0.2,0)
        this.lightA = new THREE.Mesh(lightBubble,Material)
        this.lightA.position.set(-25,0,60)
        this.lightB = this.lightA.clone()
        this.lightB.position.set(0,0,70)
        this.lightC = this.lightA.clone()
        this.lightC.position.set(25,0,60)
        this.wingSideA = new THREE.Mesh(wingSide,Material)
        this.wingSideA.position.set(-95,1,-6)
        this.wingSideA.rotation.set(0.25,1.35,1.5)
        this.wingSideB = this.wingSideA.clone()
        this.wingSideB.position.set(95,1,-6)
        this.wingSideB.rotation.set(0.25,-1.35,-1.5)
        this.engineA = new THREE.Mesh(engine,Material)
        this.engineA.position.set(0,0,-70)
        this.engineA.rotation.set(1.6,0,0)
        this.engineAFrame = new THREE.Mesh(engineFrame,Material)
        this.engineAFrame.position.set(0,0,-70)
        this.engineAFrame.rotation.set(1.6,0,0)
        this.shipUIA = new THREE.Mesh(shipUI,BodyMaterial)
        this.shipUIA.position.set(0,35,30)
        this.shipUIA.rotation.set(-0.5,0,0)
        
        this.AllSpace = new THREE.Group()
        this.AllSpace.add(this.body)
        this.AllSpace.add(this.bodyBottom)
        this.AllSpace.add(this.head)
        this.AllSpace.add(this.wingLeft)
        this.AllSpace.add(this.wingRight)
        this.AllSpace.add(this.lightA)
        this.AllSpace.add(this.lightB)
        this.AllSpace.add(this.lightC)
        this.AllSpace.add(this.wingSideA)
        this.AllSpace.add(this.wingSideB)
        this.AllSpace.add(this.engineA)
        this.AllSpace.add(this.engineAFrame)
        this.AllSpace.add(this.shipUIA)
        this.AllSpace.position.set(0,0,50)

        this.AllSpace.traverse(function(object){
            if (object instanceof THREE.Mesh) {
                object.castShadow = true
                object.receiveShadow = true
            }
        })
    }
}

function SpaceShipAnimate(obj){
    var addY = -10
    var addnumY = 0
    var addRZ = 0
    var addunmRZ = 0
    setInterval(function(){
        // posY軸
        if(addY >= 10){
            addnumY = -0.02
        }
        if(addY <= -10){
            addnumY = 0.05
        }
        addY += addnumY
        obj.position.y = addY
        // ROTZ軸
        if(addRZ >= 0.1){
            addunmRZ = -0.0005
        }
        if(addRZ <= 0){
            addunmRZ = 0.0005
        }
        addRZ += addunmRZ
        obj.rotation.z = addRZ
    })
}

function createSpaceShip(){
    spaceShipObj = new SpaceShip()
    scene.add(spaceShipObj.AllSpace)
    SpaceShipAnimate(spaceShipObj.AllSpace)
}

// 初始
function init() {
    // 場景
    scene = new THREE.Scene()
    // 渲染
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth,window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = 2
    document.body.appendChild(renderer.domElement)

    // 相機
    camera = new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,1,1000)
    camera.position.set(0,0,500)
    camera.lookAt(scene.position)
    // 三視角
    cameraControl = new THREE.OrbitControls(camera)
    cameraControl.enableDamping = true
    cameraControl.dampingFactor = 0.25
    cameraControl.minDistance = 0
    cameraControl.maxDistance = 1000
    cameraControl.enablePan = false// 關閉右鍵
    cameraControl.rotateSpeed = 0.02// 左鍵速度
    cameraControl.zoomSpeed = 0.6


    // 設置環境光提供輔助柔和白光
    let ambientLight = new THREE.AmbientLight({color:"rgb(200,200,200)",})
    let spotLight = new THREE.SpotLight({color:"rgb(255,255,255)"})
    spotLight.position.set(200, 200, -50)

    // 增加到場景
    scene.add(ambientLight)
    scene.add(spotLight)
    scene.fog = new THREE.FogExp2(0x000000, 0.0008)
    createPoints()
    createSpaceShip()
}


function render(){
    cameraControl.update()
    requestAnimationFrame(render)
    renderer.render(scene,camera)
}

// RWD
window.addEventListener('resize',function(){
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth,window.innerHeight)
})

init()
render()

var moving = false
var i = 0
var a = 0
var nowX = 0
var nowY = 0
var SSX = 0
var SSY = 0

window.addEventListener('mousemove',function(e){
    if(!moving){
        nowX = e.clientX * 0.0005
        nowY = e.clientY * 0.0005
        SSX = e.clientX * 0.004+0.8
        SSY = e.clientY * 0.001-0.4
        points.rotation.x = -nowY +i
        points.rotation.y = nowX +a

        spaceShipObj.AllSpace.rotation.x = SSY
        spaceShipObj.AllSpace.rotation.y = -SSX
    }
})
document.getElementById("pointA").addEventListener('click',function(){
    clickShow(0.003,-0.001)
    this.classList.toggle('active')
    this.classList.remove('unclick')
    document.getElementById("pointB").classList.toggle('unclick')
    document.getElementById("pointC").classList.toggle('unclick')
})
document.getElementById("pointB").addEventListener('click',function(){
    clickShow(-0.001,0.003)
    this.classList.toggle('active')
    this.classList.remove('unclick')
    document.getElementById("pointA").classList.toggle('unclick')
    document.getElementById("pointC").classList.toggle('unclick')
})
document.getElementById("pointC").addEventListener('click',function(){
    clickShow(0.001,0.001)
    this.classList.toggle('active')
    this.classList.remove('unclick')
    document.getElementById("pointA").classList.toggle('unclick')
    document.getElementById("pointB").classList.toggle('unclick')
})

function clickShow(XSpeed,YSpeed){
    moving = !moving
    var move = setInterval(function(){
        if(!moving){
            clearInterval(move)
            return
        }
        i+= XSpeed
        a+= YSpeed
        points.rotation.x = -nowY + i
        points.rotation.y = nowX + a
        return i,a
    })  
}
