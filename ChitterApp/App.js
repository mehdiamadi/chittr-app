import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const AppStackNav = createStackNavigator({
	Home: {
		screen: HomeScreen
	}
});

const AppContainer = createAppContainer(AppStackNav)
export default AppContainer;