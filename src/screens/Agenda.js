import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    FlatList,
    TouchableOpacity,
    Alert,
    //AsyncStorage,
    Platform
} from 'react-native'
import moment from 'moment'
import 'moment/locale/pt-br'
import axios from 'axios'
import 'react-native-action-button'
import commonStyles from '../commonStyles'

import { server, showError } from '../common'
import Task from '../components/Task'
import Icon from 'react-native-vector-icons/FontAwesome'
import AddTask from './AddTask'
import ActionButton from 'react-native-action-button'

import todayImage from '../../assets/imgs/today.jpg'
import tomorrowImage from '../../assets/imgs/tomorrow.jpg'
import weekImage from '../../assets/imgs/week.jpg'
import monthImage from '../../assets/imgs/month.jpg'

export default class Agenda extends Component {
    state = {
        tasks: [],
        visibleTasks: [],
        showDoneTasks: true,
        showAddTask: false,
    }

    loadTasks = async () => {
        try {
            let dataPesquisa = moment().add({ days: this.props.daysAhead }).format('DD/MM/YYYY')
            const res = await axios.get(`${server}/api/tasks?date=${dataPesquisa}`)
            this.setState({ tasks: res.data })
            this.filterTasks()
            
        } catch (error) {
            showError(error)
        }
    }

    addTask = async task => {
        
        await axios.post(`${server}/api/insertTask`,{...task})
        this.setState({ showAddTask: false })
        this.loadTasks()
    }

    updateTask = async task => {
        await axios.post(`${server}/api/updateTask`,{...task})
        this.setState({ showAddTask: false })
        this.loadTasks()
    }

    deleteTask = id => {

        this.state.tasks.forEach( async task => {
            if (task._id === id ) {
                await axios.post(`${server}/api/removeTask`,{...task})
                this.setState({ showAddTask: false })
                this.loadTasks()
            }
        })

        /*const task = this.state.tasks.filter(task => task._id === id)
        await axios.post(`${server}/api/removeTask`,{...task})
        this.setState({ showAddTask: false })
        this.loadTasks()*/
    }

    filterTasks = () => {
        let visibleTasks = null
        if (this.state.showDoneTasks) {
            visibleTasks = [...this.state.tasks]
        } else {
            const pending = task => task.doneAt === null
            visibleTasks = this.state.tasks.filter(pending)
        }
        
        this.setState({ visibleTasks })
        //AsyncStorage.setItem('tasks', JSON.stringify(this.state.tasks))
    }

    toggleFilter = () => {
        this.setState({ showDoneTasks: !this.state.showDoneTasks }
            , this.filterTasks)
    }

    componentDidMount = async () => {
        this.loadTasks()
        //const data = await AsyncStorage.getItem('tasks')
        //const tasks = JSON.parse(data) || []
        //this.setState({ tasks }, this.filterTasks)
    }

    toggleTask = id => {
        const tasks = this.state.tasks.map(task => {
            if (task._id === id) {
                task = { ...task }
                task.doneAt = task.doneAt ? null : moment().format('DD/MM/YYYY')
                this.updateTask(task)
            }
            return task
        })
        this.loadTasks()
    }

    render() {

        let styleColor = null
        let image = null

        switch (this.props.daysAhead) {
            case 0:
                styleColor = commonStyles.colors.today
                image = todayImage
                break;
            case 1:
                styleColor = commonStyles.colors.tomorrow
                image = tomorrowImage
                break;
            case 7:
                styleColor = commonStyles.colors.week
                image = weekImage
                break;
            case 30:
                styleColor = commonStyles.colors.month
                image = monthImage
                break;
            default:
                break;
        }

        return (
            <View style={styles.container}>
                <AddTask isVisible={this.state.showAddTask}
                    onSave={this.addTask}
                    onCancel={() => this.setState({ showAddTask: false })} />
                <ImageBackground source={image}
                    style={styles.background}>
                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='bars' size={20} color={commonStyles.colors.secondary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.toggleFilter}>
                            <Icon name={this.state.showDoneTasks ? 'eye' : 'eye-slash'}
                                size={20} color={commonStyles.colors.secondary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>{this.props.title}</Text>
                        <Text style={styles.subtitle}>
                            {moment().add({ days: this.props.daysAhead }).locale('pt-br').format('ddd, D [de] MMMM')}
                        </Text>
                    </View>
                </ImageBackground>
                <View style={styles.taksContainer}>
                    <FlatList data={this.state.visibleTasks}
                        keyExtractor={item => `${item._id}`}
                        renderItem={({ item }) => 
                            <Task {...item} onToggleTask={this.toggleTask}
                                onDelete={this.deleteTask} />} />
                </View>
                <ActionButton buttonColor={styleColor}
                    onPress={() => { this.setState({ showAddTask: true }) }} />
            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 3,
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 10,
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30,
    },
    taksContainer: {
        flex: 7,
    },
    iconBar: {
        marginTop: Platform.OS === 'ios' ? 30 : 10,
        marginHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
})