// Fondo red sutil
const canvas = document.getElementById("bg-animation");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for(let i=0;i<60;i++){
    particles.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        vx: (Math.random()-0.5)*0.5,
        vy: (Math.random()-0.5)*0.5
    });
}

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle="rgba(0,114,206,0.1)";
    particles.forEach(p=>{
        p.x+=p.vx;
        p.y+=p.vy;

        if(p.x<0||p.x>canvas.width)p.vx*=-1;
        if(p.y<0||p.y>canvas.height)p.vy*=-1;

        ctx.beginPath();
        ctx.arc(p.x,p.y,2,0,Math.PI*2);
        ctx.fillStyle="rgba(0,114,206,0.3)";
        ctx.fill();
    });
    requestAnimationFrame(animate);
}
animate();

// Guardar link formulario
function guardarLink(){
    const link=document.getElementById("formLink").value;
    localStorage.setItem("cshForm",link);
    document.getElementById("btnUnete").href=link;
}

window.onload=function(){
    const saved=localStorage.getItem("cshForm");
    if(saved) document.getElementById("btnUnete").href=saved;
};

const input=document.getElementById("input");
const output=document.getElementById("output");

input.addEventListener("keypress",function(e){
    if(e.key==="Enter"){
        const cmd=input.value;
        let res="Comando no reconocido";

        if(cmd==="help") res="about | events | join | clear";
        if(cmd==="about") res="CSH - Comunidad de Ciberseguridad";
        if(cmd==="events") res="Revisa la sección de eventos.";
        if(cmd==="join") res="Dirígete a Únete.";
        if(cmd==="clear"){output.innerHTML=""; input.value=""; return;}

        output.innerHTML+=`<div>> ${cmd}</div><div>${res}</div>`;
        input.value="";
    }
});