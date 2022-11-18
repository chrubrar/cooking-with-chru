import { getAllSlugs, getPostData } from "../../lib/posts";
import Link from "next/link";
import styles from "../../styles/BlogPost.module.css";
import { request } from "../../lib/datocms";
import { Image, StructuredText } from "react-datocms";

export default function BlogPost(props) {
  const { postData } = props;

  return (
    <div className={styles.container}>
      <div style={{ maxWidth: "600px", marginTop: "20px" }}>
        <Image data={postData.coverImage.responsiveImage} />
        <h1>{postData.title}</h1>
        <p>
          {postData.author.name} / {postData.publishedDate}{" "}
        </p>
        <StructuredText
          data={postData.content}
          renderBlock={({ record }) => {
            switch (record.__typename) {
              case "ImageRecord":
                return <Image data={record.image.responsiveImage} />;
              default:
                return null;
            }
          }}
        />

        <div style={{ marginTop: "50px" }}>
          <Link href="/">Back to Home Page</Link>
        </div>
      </div>
    </div>
  );
}

const PATHS_QUERY = `
query MyQuery {
  allArticles {
    slug
  }
}
`;

export const getStaticPaths = async () => {
  const slugQuery = await request({
    query: PATHS_QUERY,
  });

  let paths = [];
  slugQuery.allArticles.map((p) => paths.push(`/blog/${p.slug}`));

  return {
    paths,
    fallback: false,
  };
};

const ARTICLE_QUERY = `
query MyQuery($slug: String) {
  article(filter: {slug: {eq: $slug}}) {
    author {
      name
    }
    content {
      value
      blocks {
        __typename
        ... on ImageRecord{
          id
          image { 
             responsiveImage {
              width
              webpSrcSet
              title
              srcSet
              src
              sizes
              height
              bgColor
              base64
              aspectRatio
              alt
      				}
          
          }
        }
      }	
      
    }
    coverImage {
      responsiveImage {
        width
        webpSrcSet
        title
        srcSet
        src
        sizes
        height
        bgColor
        base64
        aspectRatio
        alt
      }
    }
    id
    publishedDate
    slug
    title
  }
}


`;

export const getStaticProps = async ({ params }) => {
  const post = await request({
    query: ARTICLE_QUERY,
    variables: { slug: params.slug },
  });
  return {
    props: {
      postData: post.article,
    },
  };
};
