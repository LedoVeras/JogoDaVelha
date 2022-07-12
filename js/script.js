const principalGrid = document.getElementById("grid");
const lineDiv = document.getElementById("line");
const imgVez = document.getElementById("imgVez");
const mostraVez = document.getElementById("mostraVez");

var squares = []

var values = Array(9).fill(-2);
var JogadorDaVez = true; //true = X, false = O

let lineWidth = 630;
let win = false;

lineDiv.style.width = lineWidth + 'px';

for (let i = 0; i < 9; i++) {
    let nSquare = document.createElement("div");

    principalGrid.append(nSquare);

    nSquare.id = ""

    nSquare.addEventListener("click", function() {
        updateSquare(i);
      });
      
      console.log(getOffset(nSquare));
    squares.push(nSquare);
}

function updateSquare(index)
{
    if(win) {return;}

    var square = squares[index];

    if(square.className !== ""){return;}
    
    setToValues(index, getJogador());

    WinCheck();
    atualizaJogador()
}

function atualizaJogador(){
    JogadorDaVez = !JogadorDaVez;
    
    imgVez.className = getJogador().value;
}

function Win(winInfo)
{
    if(winInfo)
        createLine(winInfo);
        
    win = true;

    mostraVez.innerHTML = "Fim de Jogo";
    delete imgVez;
}

function createLine(winInfo){

    let winPos = winInfo.winPos

    let offset0 = getOffset(squares[0])
    let offset = getOffset(squares[4]);

    let offsetX = 50;

    let lineHeight = 19;

    let gridTop = offset.top  + offset.height/2; //middle
    let gridLeft = (offset.left - offset.width); //middle

    switch(winPos[0]){
        case 'h':
            
            let distanceY = offset.height * parseInt(winPos[1]);
            gridTop = distanceY + offset0.top + (offset.height/2) - (lineHeight/2);
            gridLeft -= offsetX;

            break;
        case 'v':

            gridTop = 0;
            let distanceX = offset.height * parseInt(winPos[1]);
            gridLeft = distanceX + offset0.left + (offset.width/2);

            changeRotation(90);

            break;
        case 'c':
            //raiz quadrada de 2 * tamanho da linha
            lineDiv.style.width = (lineWidth * (2 ** 0.5)) + 'px';
            gridLeft -= offsetX;
            
            let isCrescente = winPos[1] !== 'd'? -1 : 1;

            gridTop -= offset.height * 2 * isCrescente;
            gridTop += (isCrescente === 1? (lineHeight * 3 / 2) : -lineHeight * 2.5);
            
            changeRotation(45 * isCrescente);
            break;
    }
    

    lineDiv.className = `line${winInfo.whoWin}`;

    lineDiv.style.opacity = 1;
    lineDiv.style.top = `${gridTop}px`;
    lineDiv.style.left= `${gridLeft}px`;

    lineDiv.style.animationName = 'sizeIncrease';
};


function setToValues(index, toSet)
{
    squares[index].className = toSet.value;
    values[index] = toSet.number;
}

function getJogador(){
    return JogadorDaVez? {value:"X", number: 1} : {value:"O", number: 2};
}

function changeRotation(rot){
    lineDiv.style.transform = `rotate(${rot}deg)`;
}

function WinCheck()
{
    if(!values.includes(-2)){
        Win(null);
        return;
    }

    let toVerify = [];
    let VerifyType = [];
    
    for (let N = 0; N < 3; N++) {
        let horizontal = values.filter((a, i) => i === (i % 3) + N * 3);
        let vertical = values.filter((a, i) => (i - N) % 3 === 0);
        
        toVerify.push(horizontal);
        VerifyType.push(`h${N}`);
        toVerify.push(vertical);
        VerifyType.push(`v${N}`);
    }
    
    //*** diagonais
    var cres = values.filter((a, i) => [2, 4, 6].includes(i));
    var deCres = values.filter((a, i) => [0, 4, 8].includes(i));
    
    toVerify.push(cres);
    toVerify.push(deCres);
    
    VerifyType.push(`c`);
    VerifyType.push(`cd`);

    for(let item of toVerify) {
        let total = item.reduce((total, value) => {
            total += value
            return total;
        }, 0);
        
        //When Win
        if(total > 0 && total % 3 === 0){
            whoWin = total === 3? "X" : "O";
            whoWin1 = total / 3;

            let winPos = VerifyType[toVerify.indexOf(item)];
            let winInfo = {win:true, whoWin: whoWin, whoWin1:whoWin1, winPos:winPos}
            
            Win(winInfo);

            return;
        }
    }
    
    return {win:false};
}

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    
    return {
        width: rect.width,
        height: rect.height,
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
      x: rect.top - (rect.width/2),
      y: rect.left - (rect.height/2)
    };
  }