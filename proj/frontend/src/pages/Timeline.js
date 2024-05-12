import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useUserData from '../hook/useUserData';
import { Card, Avatar, Button } from 'antd';
import BaseLayout from '../components/BaseLayout';
import { Link } from 'react-router-dom';

const { Meta } = Card;

const Timeline = () => {
  const [timeline, setTimeline] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const user = useUserData();

  useEffect(() => {
    if (!user) return; // If user is not available, do nothing
    const fetchTimeline = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/timeline/${encodeURIComponent(user.id)}?page=${currentPage}`);
        console.log(response)
        setTimeline(response.data[0].activities);
        // Assuming the backend sends the total number of pages along with the timeline data
        setTotalPages(Math.ceil(response.data[0].totalDocs / 30)); // Assuming page size is 10
      } catch (error) {
        console.error('Error fetching timeline:', error);
      }
    };

    fetchTimeline();
  }, [user, currentPage]);

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
    window.scrollTo(0, 0);

  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
    window.scrollTo(0, 0);

  };

  return (
    <BaseLayout>
      <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1>Timeline</h1>
        {timeline.map((change, index) => (
          <Card key={index} style={{ width: 450, backgroundColor: '#f9f9f9', marginBottom: '1.5em' }}>
            <div style={{ position: 'absolute', top: '1.5em', right: 0, padding: '0 19px' }}>
              {change.timestamp}
            </div>
            <Meta
              avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
              title={<Link to={`/users/${change.userId}`}>{change.username}</Link>}
              description={
                <p>
                  {change.action === 'reaction' ?
                    `${change.likes === 1 ? 'Liked' : 'Disliked'} ` :
                    'Commented about '}
                  <Link to={`/${change.vertexType.toLowerCase()}/${encodeURIComponent(change.movieId)}`}>
                    {change.vertexLabel}
                  </Link>
                </p>
              }
/>
         
            {change.action === 'comment' && (
              <p>{change.content}</p>
            )}
          </Card>
        ))}
        <div style={{ textAlign: 'center', marginTop: '1em' }}>
          <Button disabled={currentPage === 1} onClick={handlePrevPage}>Previous</Button>
          <span style={{ margin: '0 10px' }}>Page {currentPage} of {totalPages}</span>
          <Button disabled={currentPage >= totalPages} onClick={handleNextPage}>Next</Button>
        </div>
      </div>
    </BaseLayout>
  );
  
};

export default Timeline;
