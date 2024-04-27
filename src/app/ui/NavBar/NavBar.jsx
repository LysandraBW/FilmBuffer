import Link from 'next/link';
import styles from './NavBar.module.css';
import { dm_sans } from '@/app/ui/font';

export default function NavBar(props) {
    return (
        <nav className={`${styles.nav} ${props.theme === 'dark' ? styles.dark : ''}`}>
            <div className={`${styles.icon} ${dm_sans.className} antialiased`}>FilmBuffer</div>
            <div className={styles.linkContainer}>
                {props.not != "home" && <Link href="/">Home</Link>}
                {props.not != "all" && <Link href="/query_overview">Queries</Link>}
                {props.not != "1" && <Link href="/query/1">Query 1</Link>}
                {props.not != "2" && <Link href="/query/2">Query 2</Link>}
                {props.not != "3" && <Link href="/query/3">Query 3</Link>}
                {props.not != "4" && <Link href="/query/4">Query 4</Link>}
                {props.not != "5" && <Link href="/query/5">Query 5</Link>}
            </div>
        </nav>
    )
}
