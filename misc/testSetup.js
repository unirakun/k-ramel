import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

global.regeneratorRuntime = require('regenerator-runtime')

Enzyme.configure({ adapter: new Adapter() })
