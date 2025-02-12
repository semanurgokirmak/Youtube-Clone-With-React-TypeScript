import React, { useEffect, useState, useCallback } from "react";
import { Box, Image, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { Link } from "react-router-dom";

// API Key dışarıdan bir değişken olarak tanımlandı
const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;

export default function RightVideos() {
  const [videos, setVideos] = useState<Array<any>>([]);

  const fetchVideos = useCallback(async () => {
    if (!apiKey) {
      console.error("API key bulunamadı!");
      return;
    }

    try {
      const response = await axios.get(
        "https://youtube.googleapis.com/youtube/v3/videos",
        {
          params: {
            part: "snippet,contentDetails,statistics",
            chart: "mostPopular",
            regionCode: "TR",
            maxResults: 10,
            key: apiKey,
          },
        }
      );
      setVideos(response.data.items);
    } catch (error) {
      console.error("Video fetch hatası:", error);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return (
    <Box w={"350px"} p={5} position="absolute" top="0" right="0">
      <VStack
        direction="column"
        w="full"
        justify="space-between"
        align="center"
      >
        <Text fontSize="lg" fontWeight="bold">
          Next
        </Text>
      </VStack>

      <Box w="full">
        <VStack gap={5}>
          {videos.map((video, index) => (
            <VStack key={index} w="full" align="start" gap={0.8}>
              <Link to={`/video/${video.id}`}>
                <Box position="relative" width="300px" height="170px">
                  <Image
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    borderRadius="2xl"
                    width="300px"
                    height="170px"
                  />
                </Box>
              </Link>
              <Text fontSize={"16px"} fontWeight="bold" textAlign="left">
                {video.snippet.title}
              </Text>
              <Text fontSize="13px" color="gray.500" textAlign="left">
                {new Intl.NumberFormat("tr-TR").format(
                  video.statistics.viewCount
                )}{" "}
                görüntüleme
              </Text>
            </VStack>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}
