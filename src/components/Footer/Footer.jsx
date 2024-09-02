import { FaCopyright } from 'react-icons/fa'
import classes from './Footer.module.css'

const Footer = () => {
  return (
      <footer className={classes.footer}>
        <span><FaCopyright /> Criado Pela B-Rush/2023</span>
      </footer>
  )
}

export default Footer
