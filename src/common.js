import { Alert, Platform } from 'react-native'

const server = Platform.OS === 'ios' ?
    'http://localhost:3001' : 'http://localhost:3001'

function showError(err) {
    Alert.alert('Ops! Ocorreu um erro', `Mensagem: ${err.response.data.errors.errors[0]}`)
}

export { server, showError }