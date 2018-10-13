import React, {Component} from 'react'
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    Alert,
    AsyncStorage
} from 'react-native'
import axios from 'axios'

import { server, showError} from '../common'
import commonStyles from '../commonStyles'
import backgroundImage from '../../assets/imgs/login.jpg'
import AuthInput from '../components/AuthInput'

export default class Auth extends Component {
    state = {
        stageNew: false,
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    }

    signup = async () => {
        try {
            await axios.post(`${server}/signup`, {
                username: this.state.name,
                email: this.state.email,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword
            })
            Alert.alert('Sucesso!', 'Usuário Cadastrado com Sucesso')
            this.setState({ stageNew: false })

        } catch (err) {
            showError(err)
        }
    }

    signin = async () => {
        try {
            const res = await axios.post(`${server}/login`, {
                username: this.state.name,
                password: this.state.password
            })

            axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`
            AsyncStorage.setItem('userData',JSON.stringify(res.data))
            this.props.navigation.navigate('Home', res.data)
        } catch (err) {
            showError(err)
        }
    }

    signinOrSignup = async () => {
        
        if (this.state.stageNew) {
            this.signup()
        } else {
            this.signin()
        }
    }

    render() {
        const validations = []

        validations.push(this.state.name && this.state.name.trim)
        {this.state.stageNew && validations.push(this.state.email && this.state.email.trim)}
        validations.push(this.state.password && this.state.password.length >= 5)

        if (this.state.stageNew) {
            validations.push(this.state.confirmPassword)
            validations.push(this.state.confirmPassword === this.state.password)
        }

        const validForm = validations.reduce((all, v) => all && v)

        return (
            <ImageBackground source={backgroundImage}
                style={styles.background}>
                <Text style={styles.title}>AppModelo</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.subtitle}>
                        {this.state.stageNew ? 
                            'Criar a conta' : 'Informar seus dados'}
                    </Text>
                    <AuthInput icon='user' placeholder='Nome' style={styles.inout}
                            value={this.state.name}
                            onChangeText={name => this.setState({name})}/>

                    {this.state.stageNew && 
                        <AuthInput icon='envelope-square' placeholder='email' style={styles.inout}
                        value={this.state.email}
                        onChangeText={email => this.setState({email})}/>}
                    
                    <AuthInput icon='lock' secureTextEntry={true} placeholder='Senha' style={styles.inout}
                            value={this.state.password}
                            onChangeText={password => this.setState({password})}/>
                    {this.state.stageNew &&
                        <AuthInput icon='asterisk' secureTextEntry={true} placeholder='Confirmar Senha' style={styles.inout}
                        value={this.state.confirmPassword}
                        onChangeText={confirmPassword => this.setState({confirmPassword})}/> }

                    <TouchableOpacity disabled={!validForm} onPress={this.signinOrSignup}>
                        <View style={[styles.button, !validForm ? { backgroundColor: '#AAA'} : {}]}>
                            <Text style={styles.buttonText}>
                                {this.state.stageNew ? 'Registrar' : 'Entrar'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{padding: 10}}
                    onPress={() => this.setState({
                        stageNew: !this.state.stageNew
                    })}>
                <Text style={styles.buttonText}>
                    {this.state.stageNew ? 'Já possui conta?'
                        : 'Ainda não possui conta?'}
                </Text>    
                </TouchableOpacity>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 70,
        marginBottom: 10,
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
    },
    formContainer: {
        backgroundColor: 'rgb(0,0,0)',
        padding: 20,
        width: '90%',
    },
    inout: {
        marginTop: 10,
        backgroundColor: '#FFF',
    },
    button: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
    }
})