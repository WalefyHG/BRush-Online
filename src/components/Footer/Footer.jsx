import { FaCopyright } from 'react-icons/fa'
import classes from './Footer.module.css'

const Footer = () => {
  return (
      <div className={classes.footer}>
        <span><FaCopyright /> Criado Pela B-Rush/2023</span>
      </div>
  )
}

export default Footer
