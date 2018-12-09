import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { MATCH_SCREEN, USER_DISCOVERY_SCREEN, PROJECT_LIST_SCREEN, SETTING_LIST_SCREEN } from '../../constants/screens';
import { SEARCH_BUTTON, PROJECT_NEW_BUTTON } from '../../constants/buttons';
import IconLoader from '../../utilities/IconLoader';
import {
  LIBRARY_BOOKS_ICON,
  MESSAGE_OUTLINE_ICON,
  PENCIL_ICON,
  ACCOUNT_ICON,
  FILTER_OUTLINE_ICON
} from '../../constants/icons';
import {
  TabBarBackgroundColor,
  TabBarSelectedButtonColor,
  TabBarButtonColor,
  NotificationBadgeColor,
  NavBarBackgroundColor,
  NavBarButtonColor,
  NavBarTextColor
} from '../../constants/colors';

const MainTab = () => {
  Promise.all([
    Icon.getImageSource('md-map', 30),
    Icon.getImageSource('filter-outline', 30),
    Icon.getImageSource('ios-share-alt', 30),
    Icon.getImageSource('ios-menu', 30)
  ]).then(() => {
    Navigation.startTabBasedApp({
      appStyle: {
        bottomTabBadgeBackgroundColor: NotificationBadgeColor,
        navBarTextColor: NavBarTextColor,
        navBarBackgroundColor: NavBarBackgroundColor,
        navBarButtonColor: NavBarButtonColor,
        statusBarTextColorScheme: 'light',
        statusBarColor: NavBarButtonColor,
        statusBarTextColorSchemeSingleScreen: 'light'
      },
      tabsStyle: {
        tabBarButtonColor: TabBarButtonColor,
        tabBarBackgroundColor: TabBarBackgroundColor,
        tabBarSelectedButtonColor: TabBarSelectedButtonColor
      },
      tabs: [
        {
          screen: USER_DISCOVERY_SCREEN,
          label: 'Discovery',
          title: 'Discovery',
          icon: IconLoader.getIcon(LIBRARY_BOOKS_ICON),
          navigatorButtons: {
            leftButtons: [
              {
                icon: IconLoader.getIcon(FILTER_OUTLINE_ICON),
                title: 'Search',
                id: SEARCH_BUTTON
              }
            ]
          }
        },
        {
          screen: MATCH_SCREEN,
          label: 'Match',
          title: 'Match',
          icon: IconLoader.getIcon(MESSAGE_OUTLINE_ICON)
        },
        {
          screen: PROJECT_LIST_SCREEN,
          label: 'ProjectList',
          title: 'ProjectList',
          icon: IconLoader.getIcon(PENCIL_ICON),
          navigatorButtons: {
            rightButtons: [
              {
                icon: IconLoader.getIcon(PENCIL_ICON),
                title: 'New',
                id: PROJECT_NEW_BUTTON
              }
            ]
          }
        },
        {
          screen: SETTING_LIST_SCREEN,
          label: 'Settings',
          title: 'Settings',
          icon: IconLoader.getIcon(ACCOUNT_ICON)
        }
      ],
      drawer: {}
    });
  });
};

export default MainTab;
