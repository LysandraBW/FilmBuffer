'use client';
import Image from 'next/image';
import Link from 'next/link';
import NavBar from './ui/NavBar/NavBar';
import styles from '@/app/ui/home.module.css';

export default function Page() {
    const generateImages = () => {
        const M = 0.9;
        const imageDimensions = [[100*M, 150*M], [200*M, 300*M], [225*M, 337.5*M], [227*M, 412.5*M]];
        const images = [
            ["/TLOU.jpg",           ...imageDimensions[0], "The Last of Us"],
            ["/RagingBull.jpg",     ...imageDimensions[1], "Raging Bull"],
            ["/TaxiDriver.jpg",    ...imageDimensions[2], "Taxi Driver"],
            ["/Whiplash.png",       ...imageDimensions[3], "Whiplash"],
            ["/AmericanPsycho.jpg", ...imageDimensions[2], "American Pyscho"],
            ["/PastLives.jpg",      ...imageDimensions[1], "Past Lives"],
            ["/Parasite.jpg",       ...imageDimensions[0], "Parasite"]
        ];
    
        return images.map((image) => (
            <div key={`${image[0]}`}>
                <Image
                    src={image[0]}
                    width={image[1]}
                    height={image[2]}
                    alt={image[3]}
                />
            </div>
        ));
    };
    
    return (
        <div className={styles.container}>
            <NavBar 
                not="home"
                theme="dark">
            </NavBar>
            <div className={styles.moviePosterContainer}>
                {generateImages()}
            </div>
            <div className={styles.hook}>
                <h3>Your first choice for analyzing media.</h3>
                <Link className={styles.button} href="/query_overview">Begin</Link>
            </div>
        </div>
    )
}