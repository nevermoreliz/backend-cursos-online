const handleResponseJson = (res, code, data = {}, msg = 'Todo Correcto', paginacion = null) => {

  const response = { ok: true, msg, data }

  if (paginacion) {
    response.paginacion = paginacion
  }

  res.status(code).json(response)
}

const handleResponseJsonMsg = (res, code = 200, msg = 'Verificar', ok = true) => {

  const response = { ok, msg }

  res.status(code).json(response);
}

module.exports = { handleResponseJson, handleResponseJsonMsg }