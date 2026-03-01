const questions = [
  {q:"Capital do Brasil?", o:["SP","RJ","Brasília","BH"], c:2},
  {q:"2+2?", o:["3","4","5","6"], c:1}
];

let qlist = [];
let i = 0;
let score = 0;
let startTime;

function shuffle(a){
  return a.sort(()=>Math.random()-0.5);
}

function start(){
  let name = document.getElementById("name").value;
  if(!name) return alert("Digite seu nome");

  startTime = Date.now();
  i=0; score=0;

  qlist = shuffle(questions).map(q=>{
    let opts = q.o.map((t,idx)=>({t,idx}));
    opts = shuffle(opts);
    return {
      q:q.q,
      o:opts.map(x=>x.t),
      c:opts.findIndex(x=>x.idx===q.c)
    }
  });

  show();
}

function show(){
  let q = qlist[i];
  document.getElementById("question").innerText = q.q;

  let ans = document.getElementById("answers");
  ans.innerHTML="";

  q.o.forEach((op,idx)=>{
    let b = document.createElement("button");
    b.innerText = op;

    b.onclick=()=>{
      if(idx===q.c){
        b.classList.add("correct");
        score++;
      } else {
        b.classList.add("wrong");
      }

      setTimeout(()=>{
        i++;
        if(i<qlist.length) show();
        else finish();
      }, 500);
    };

    ans.appendChild(b);
  });

  document.getElementById("bar").style.width =
    ((i/qlist.length)*100)+"%";
}

function finish(){
  let totalTime = Math.floor((Date.now()-startTime)/1000);

  fetch("/save",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      name:document.getElementById("name").value,
      score,
      time:totalTime
    })
  });

  alert(`Acertos: ${score} | Tempo: ${totalTime}s`);
}

function loadRanking(){
  fetch("/ranking")
  .then(r=>r.json())
  .then(data=>{
    let list = document.getElementById("ranking");
    list.innerHTML="";

    data.forEach((p,i)=>{
      let div = document.createElement("div");
      div.innerHTML =
        `<b>#${i+1}</b> ${p[0]} - ${p[1]} acertos (${p[2]}s)`;
      list.appendChild(div);
    });
  });
}
