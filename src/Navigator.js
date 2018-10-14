import React from 'react'
import {createSwitchNavigator, createDrawerNavigator} from 'react-navigation'

import Menu from './screens/Menu'
import Agenda from './screens/Agenda'
import Auth from './screens/Auth'
import Chat from './screens/Chat'
import AuthOrApp from './screens/AuthOrApp'
import commonsStyle from './commonStyles'

const MenuRoutes = {
    Today: {
        name: 'Today',
        screen: props => <Chat title='Hoje' daysAhead={0} {...props} />,
        navigationOptions: {
            title: 'Hoje'
        }
    },
    Tomorrow: {
        name: 'Tomorrow',
        screen: props => <Chat title='Amanhã' daysAhead={1} {...props} />,
        navigationOptions: {
            title: 'Amanhã'
        }
    },
    Week: {
        name: 'Week',
        screen: props => <Chat title='Semana' daysAhead={7} {...props} />,
        navigationOptions: {
            title: 'Semana'
        }
    },
    Month: {
        name: 'Month',
        screen: props => <Chat title='Mês' daysAhead={30} {...props} />,
        navigationOptions: {
            title: 'Mês'
        }
    }
}

const MenuConfig= {
    initialRouteName: 'Today',
    contentComponent: Menu,
    contentOptions: {
        lableStyle: {
            fontFamily: commonsStyle.fontFamily,
            fontWeight: 'nomal',
            fontSize: 20
        },
        activeLabelStyle: {
            color: '#080',

        }
    }
}

const MenuNavigator = createDrawerNavigator(MenuRoutes, MenuConfig)

const MainRoutes = {
    Loading: {
        name: 'Loading',
        screen: AuthOrApp
    },
    Auth: {
        name: 'Auth',
        screen: Auth
    },
    Home: {
        name: 'Home',
        screen: MenuNavigator
    }
}

const MainNavigator = 
    createSwitchNavigator(MainRoutes, { 
        initialRouteName: 'Loading' 
})

export default MainNavigator