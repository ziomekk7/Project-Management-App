import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider,} from '@chakra-ui/react'
import theme from './theme.ts'



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<ChakraProvider theme={theme}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
	</ChakraProvider>
)
