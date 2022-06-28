import Layout from "@/components/Layout";
import EventItem from "@/components/EventItem";
import Pagination from "@/components/Pagination";
import { API_URL, PER_PAGE } from "@/config/index";

export default function EventsPage({ events, page, total }) {
  return (
    <Layout>
      <h1>Events</h1>
      {events.length === 0 && <h3>No events to show</h3>}

      {events.map((evt) => (
        <EventItem key={evt.id} evt={evt.attributes} />
      ))}
      <Pagination page={page} total={total} />
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  // Calculate Number page
  const res = await fetch(
    `${API_URL}/events?pagination[page]=${query["pagination[page]"]}`
  );
  const evtRes = await res.json();
  const { meta } = evtRes;
  const total = meta.pagination.total;
  const page = meta.pagination.page;

  const start = +page === 1 ? 0 : (+page - 1) * PER_PAGE;

  // Calculate start page
  const eventRes = await fetch(
    `${API_URL}/events?pagination[start]=${start}&pagination[limit]=${PER_PAGE}&populate=*`
  );
  const events = await eventRes.json();
  const { data } = events;

  return {
    props: {
      events: data.sort((a, b) => {
        return new Date(a.attributes.date) - new Date(b.attributes.date);
      }),
      page: page,
      total,
    },
  };
}
