export default function generateString(
    sizeLimit = 11,
    dashUsed = false,
    dashEachNumber = 6
) {
    dashUsed && sizeLimit++;
    dashEachNumber++;
    const alphabet = [
        "A",'a',"B",'b',
        "C",'c',"D",'d',
        "E",'e',"F",'f',
        "G",'g',"H",'h',
        "I",'i',"J",'j',
        "K",'k',"L",'l',
        "M",'m',"N",'n',
        "O",'o',"P",'p',
        "Q",'q',"R",'r',
        "S",'s',"T",'t',
        "U",'u',"V",'v',
        "W",'w',"X",'x',
        "Y",'y',"Z",'z'
    ];
    let generatedString = '';
    alphabet.map((_, i) => {
        if (i < sizeLimit) {
            let randomNumber = Math.floor(Math.random() * alphabet.length + 10);
            let genedStringLength = generatedString.length;
            let numberToRandom = 62 - ++randomNumber;
            if (numberToRandom == 10) numberToRandom++;
            let characterToAdd = Math.floor(Math.random() * numberToRandom);
            if (dashUsed) {
                if (randomNumber >= 52) {
                    generatedString += ++genedStringLength % dashEachNumber == 0 ? '-' : characterToAdd;
                } else {
                    generatedString += ++genedStringLength % dashEachNumber == 0 ? '-' : alphabet[randomNumber];
                }
            } else {
                if (randomNumber >= 52) {
                    generatedString += characterToAdd;
                } else {
                    generatedString += alphabet[randomNumber];
                }
            }
        }
    });
    if (generatedString.charAt(generatedString.length - 1) == '-') {
        let nameCopy = generatedString.split('');
        nameCopy[nameCopy.length - 1] = '';
        generatedString = nameCopy.join('');
    }

    return generatedString;
}