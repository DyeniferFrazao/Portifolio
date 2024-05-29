var hello = document.querySelector('#text')

var texto = hello.innerHTML

var index = 0

const write = () => {
    hello.innerHTML = hello.innerHTML.replace('|','')

    if (texto.length > index) {
        if (index == 0) {
            hello.innerHTML = texto.charAt(index)
        } else {
            hello.innerHTML += texto.charAt(index)
        }
        hello.innerHTML += '|'

        index++
        setTimeout(write, 70)
    }
}
write();

