import React from 'react'
import Todos from './components/todos'
import Header from './components/header'
import Footer from './components/footer'

const App = () => (
  <React.StrictMode>
    <section className="todoapp">
      <Header />
      <Todos />
      <Footer />
    </section>
  </React.StrictMode>
)

export default App
