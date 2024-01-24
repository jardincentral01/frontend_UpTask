
const limpiarForm = (form) =>{
    Object.keys(form).forEach(key => key != 'id' ? form[key] = form[key].trim() : null)
    return form
}

export default limpiarForm