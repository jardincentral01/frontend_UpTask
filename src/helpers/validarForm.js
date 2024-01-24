
const validarForm = (e, inputs) => {
    const form = e.target
    let a = []
    inputs.forEach(input => {
        a.push(form.elements[input])
    })
    a.forEach(input => {
        input.classList.add("border-2", "border-red-500")
    })
}

export default validarForm