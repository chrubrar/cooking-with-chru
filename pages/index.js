import Head from "next/head";
import Link from "next/link";
//import Image from "../components/Image/Image";
//import { getAllPosts, getPostData } from "../lib/posts";
import styles from "../styles/Home.module.css";
import { request } from "../lib/datocms";
import { Image } from "react-datocms";

const HOMEPAGE_QUERY = `
query MyQuery {
  allArticles {
    title
    author {
      name
    }
    content {
      value
    }
    coverImage {
      responsiveImage {
        alt
        aspectRatio
        base64
        bgColor
        height
        sizes
        src
        srcSet
        title
        webpSrcSet
        width
      }
    }
    excerpt
    id
    publishedDate
    slug
  }
}`;
export async function getStaticProps() {
  const data = await request({
    query: HOMEPAGE_QUERY,
  });
  return {
    props: { data },
  };
}

export default function Home(props) {
  //const posts = getAllPosts();
  const { data } = props;
  const posts = data.allArticles;
  console.log(data);
  return (
    <div className={styles.main1}>
      <Head>
        <title>Cooking with Chru</title>=
      </Head>
      <div>
        <h1>Cooking With Chru</h1>
      </div>
      <div>
        {posts.map((p) => (
          <BlogPostPreview key={p.id} data={p} />
        ))}
      </div>
    </div>
  );
}

const BlogPostPreview = (props) => {
  const { data } = props;
  return (
    <div style={{ maxWidth: "400px", marginBottom: "50px" }}>
      <Image data={data.coverImage.responsiveImage} />
      <h2>
        <Link href={`/blog/${data.slug}`}>{data.title}</Link>
      </h2>
      <div>{data.publishDate}</div>
      <p>{data.excerpt}</p>
      <div style={{ fontWeight: "bold" }}>{data.author.name}</div>
    </div>
  );
};
