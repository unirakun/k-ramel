import React from 'react'
import Todos from './components/todos'
import Header from './components/header'
import Footer from './components/footer'

const App = () => (
  <section className="todoapp">
    <Header />
    <Todos />
    <Footer />
  </section>
)

export default App
