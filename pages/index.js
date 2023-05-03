import Head from 'next/head'
import Layout, { siteTitle } from '../components/Layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData, getFox } from '../lib/posts'
import useSWR from 'swr'

// gets fox from exernal api
const fetcher = (url) => fetch(url).then((res) => res.json())

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  const fox = await getFox()
  return {
    props: {
      allPostsData,
      fox,
    },
  }
}

export default function Home({ allPostsData, fox }) {
  const { data, error, isLoading, mutate } = useSWR(
    'https://randomfox.ca/floof/',
    fetcher,
    { refreshWhenHidden: false, refreshInterval: 0 }
  )

  const handleClick = () => {
    mutate()
  }

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>This is a practice site for Bridget Mahy to learn Next.js</p>
        <p>
          (This is a sample website - you’ll be building a site like{' '}
          <a href="https://next-learn-starter.vercel.app/" target="_blank">
            this
          </a>{' '}
          on <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={`${utilStyles.headingLg} underline`}>
          Server/Client rendering practice
        </h2>
        <div className="py-4 flex">
          <div className="flex-col mr-3">
            <img className="h-60 w-60 object-cover" src={fox.image} />
            <p className="font-light w-60">
              {' '}
              <a href={fox.link} target="_blank">
                fox
              </a>{' '}
              retrieved from server lib using static props - fetching requires a
              new HTTP request (page reload)
            </p>
          </div>
          {error && <p>failed to load fox</p>}
          {isLoading && <p>loading fox</p>}
          <div className="flex-col ml-3">
            {data && (
              <>
                <img
                  className="h-60 w-60 object-cover hover:cursor-pointer"
                  src={data.image}
                  onClick={handleClick}
                />
                <p className="font-light w-60">
                  <a href={data.link} target="_blank">
                    fox
                  </a>{' '}
                  retrieved on client side using the swr hook which includes
                  error/load handling - fetches a new fox onclick.
                </p>
              </>
            )}
          </div>
        </div>
        <h2 className={`${utilStyles.headingLg} underline`}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              {title}
              <br />
              {id}
              <br />
              {date}
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}
