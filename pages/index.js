import Link from "next/link";
import Layout from "@/components/Layout";
import EventItem from "@/components/EventItem";
import { API_URL } from "@/config/index";

export default function HomePage({ events }) {
  return (
    <Layout>
      <h1>Upcoming Events</h1>
      {events.length === 0 && <h3>No events to show</h3>}

      {events.map((evt) => (
        <EventItem key={evt.id} evt={evt.attributes} />
      ))}

      {events.length > 0 && (
        <Link href="/events?pagination[page]=1">
          <a className="btn-secondary">View All Events</a>
        </Link>
      )}
    </Layout>
  );
}

export async function getStaticProps() {
  const res = await fetch(`${API_URL}/events?populate=*`);
  const events = await res.json();
  const { data } = events;

  return {
    props: {
      events: data
        .sort((a, b) => {
          return new Date(a.attributes.date) - new Date(b.attributes.date);
        })
        .slice(0, 3),
    },
    revalidate: 1,
  };
}
