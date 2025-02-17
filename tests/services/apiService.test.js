import {
  fetchQuestCategoryData,
   fetchLeaderboardToppers,
  fetchLeaderboardRankings,
  getBoostById,
  getQuizById,
  fetchLeaderboardRankings,
  getTrendingQuests,
  getQuestsInBoost,
  getQuestActivityData,
  getUniqueVisitorCount,
  getTasksByQuestId,
  getDeployedTimeByAddress,
    getQuestsParticipation,
} from "@services/apiService";


const API_URL = process.env.NEXT_PUBLIC_API_LINK;

global.fetch = jest.fn();

describe('fetchQuestCategoryData function', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should fetch and return data for a valid category name', async () => {
    const mockData = {
      name: 'Quest Name',
      title: 'Quest title',
      desc: 'Quests description.',
      img_url: 'braavos/category.webp',
    };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await fetchQuestCategoryData('Quest Name');
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_quest_category?name=Quest Name`
    );
    expect(result).toEqual(mockData);
  });

  it('should handle fetch errors gracefully', async () => {
    const mockResponse = 'Category not found';
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await fetchQuestCategoryData('InvalidCategory');
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_quest_category?name=InvalidCategory`
    );
    expect(result).toEqual(mockResponse);
  });
});

describe('getQuestsParticipation', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should fetch and return data for a valid id', async () => {
    const mockData = [
      {
        name: 'Register a stark domain',
        desc: "In order to create a Starknet Profile, you need a Stark Domain ! This domain will represent you on-chain and is integrated in all the major Starknet apps. You can use it to send & receive money on with Braavos and ArgentX, Access to all the Starknet Quest, being recognized on Starkscan or access to the Stark Name holder's advantages.",
        participants: 3,
      },
      {
        name: 'Follow Starknet Quest on Twitter',
        desc: 'Follow Starknet Quest on Twitter to get updated on their news and rewards for domain holders.',
        participants: 4,
      },
      {
        name: 'Starknet ID Tribe Quiz',
        desc: "Take part in our Starknet ID Tribe Quiz to test your knowledge, and you'll have a chance to win an exclusive Starknet ID Tribe NFT as your reward.",
        quiz_name: 'starknetid',
        participants: 3,
      },
      {
        name: 'Verify your Twitter & Discord',
        desc: 'Verify your social media on your Starknet ID will permit you to access future quests, be careful you need to verify them on the Starknet ID of your domain.',
        participants: 5,
      },
    ];
    
     fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });
    
      const result = await getQuestsParticipation(1);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_quest_participation?id=1`
       );
    expect(result).toEqual(mockData);
  });
  
   it('should handle fetch with empty response', async () => {
    const mockResponse = [];
     
      fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });
     
        const result = await getQuestsParticipation(0);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_quest_participation?id=0`
    );
    expect(result).toEqual(mockResponse);
  });

  it('should handle unexpected response', async () => {
    const mockResponse = {
      error: 500,
      message: 'Error while fetching quest participation',
      data: {},
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getQuestsParticipation();

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_quest_participation?id=undefined`
    );
    expect(result).toEqual(result);
  });

  it('should handle no response', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(undefined),
    });

    const result = await getQuestsParticipation(1);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_quest_participation?id=1`
    );
    expect(result).toBeUndefined();
  });
  
  });

describe("fetchLeaderboardToppers", () => {
  afterEach(() => {
    fetch.mockClear();
  });

  it("fetches leaderboard toppers correctly for a valid duration", async () => {
    const mockResponse = {
      best_users: [
        {
          address: "0x1234567890abcdef",
          xp: 1000,
          achievements: 8,
        },
        {
          address: "0x1234567890abcefg",
          xp: 900,
          achievements: 7,
        },
      ],
      total_users: 2,
    };
    const validDurations = ["week", "month", "all"];
    for (const duration of validDurations) {
      const params = { addr: "0x12345988hhnnef", duration };
      fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse),
      });
      const response = await fetchLeaderboardToppers(params);
      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/leaderboard/get_static_info?addr=${params.addr}&duration=${params.duration}`
      );
      expect(response).toEqual(mockResponse);
    }
  });

  it("handles fetch with empty duration", async () => {
    const params = { addr: "0x0iuh8999", duration: " " };
    const mockResponse = "Invalid Duration";
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockResponse) });
    const result = await fetchLeaderboardToppers(params);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/leaderboard/get_static_info?addr=${params.addr}&duration=${params.duration}`
    );
    expect(result).toEqual(mockResponse);
  });

  it("handles fetch with null duration", async () => {
    const params = { addr: "0xo8hb98y89y9", duration: null };
    const mockResponse = "Invalid Duration";
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockResponse) });
    const result = await fetchLeaderboardToppers(params);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/leaderboard/get_static_info?addr=${params.addr}&duration=${params.duration}`
    );
    expect(result).toEqual(mockResponse);
  });

  it("handles fetch with undefined duration", async () => {
    const params = { addr: "exampleAddr", duration: undefined };
    const mockResponse = "Invalid Duration";
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockResponse) });
    const result = await fetchLeaderboardToppers(params);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/leaderboard/get_static_info?addr=${params.addr}&duration=${params.duration}`
    );
    expect(result).toEqual(mockResponse);
  });
});

describe("getTasksByQuestId function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should handle when api returns no response", async () => {
    const mockResponse = null;
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getTasksByQuestId({ questId: "1", address: "2" });
    expect(result).toEqual(mockResponse);
  });

  it("should handle when api return response in unexpected format", async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve("Unexpected Format"),
    });

    const result = await getTasksByQuestId({ questId: "1", address: "2" });
    expect(result).not.toEqual(expect.any(Array));
  });

  it("should handle undefined values", async () => {
    const mockResponse =
      "Failed to deserialize query string: invalid character";

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    let result = await getTasksByQuestId({
      questId: undefined,
      address: undefined,
    });
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_tasks?quest_id=undefined&addr=undefined`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should handle an undefined value", async () => {
    const mockResponse =
      "Failed to deserialize query string: invalid digit found in string";

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    let result = await getTasksByQuestId({ questId: undefined, address: 2 });
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_tasks?quest_id=undefined&addr=2`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should handle null values", async () => {
    const mockResponse =
      "Failed to deserialize query string: invalid digit found in string";

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    let result = await getTasksByQuestId({ questId: null, address: 2 });
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_tasks?quest_id=null&addr=2`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should fetch and return data for a valid task", async () => {
    const mockData = [
      {
        id: 56,
        quest_id: 1,
        name: "Starknet Tribe",
        href: "https://docs.starknet.id/",
        cta: "Start Starknet Tribe Quiz",
        verify_endpoint: "quests/verify_quiz",
        verify_endpoint_type: "quiz",
        verify_redirect: null,
        desc: "Task Description",
        completed: false,
        quiz_name: null,
      },
    ];
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getTasksByQuestId({ questId: "1", address: "2" });
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_tasks?quest_id=1&addr=2`
    );
    expect(result).toEqual(mockData);
  });
});

describe("fetchLeaderboardRankings function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should fetch and return data for valid parameters", async () => {
    const mockData = {
      rankings: [
        { address: "0x123abc", xp: 100, achievements: 5 },
        { address: "0x456def", xp: 80, achievements: 3 },
        { address: "0x789ghi", xp: 120, achievements: 7 },
      ],
      first_elt_position: 1,
    };
    
     fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });
    
    const params = { addr: '', page_size: 10, shift: 0, duration: 'week' };
    const result = await fetchLeaderboardRankings(params);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/leaderboard/get_ranking?addr=&page_size=10&shift=0&duration=week`
      
       );
    expect(result).toEqual(mockData);
  });
  
   it("should handle API returning no response", async () => {
    const mockResponse = undefined;
     
      fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const params = {
      addr: "invalidAddr",
      page_size: -1,
      shift: 0,
      duration: "string",
    };

    const result = await fetchLeaderboardRankings(params);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/leaderboard/get_ranking?addr=invalidAddr&page_size=-1&shift=0&duration=string`
    );
    expect(result).toBeUndefined();
  });

  it("should handle API returning response in unexpected format", async () => {
    const mockResponsePageSize = "Error querying ranks";
    const mockResponseDuration = "Invalid duration";

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponsePageSize),
    });

    const paramsPageSize = {
      addr: "sampleAddr",
      page_size: -1,
      shift: 0,
      duration: "week",
    };
    const resultPageSize = await fetchLeaderboardRankings(paramsPageSize);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/leaderboard/get_ranking?addr=sampleAddr&page_size=-1&shift=0&duration=week`
    );
    expect(resultPageSize).toEqual(mockResponsePageSize);

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponseDuration),
    });

    const paramsDuration = {
      addr: "sampleAddr",
      page_size: 10,
      shift: 0,
      duration: "string",
    };
    const resultDuration = await fetchLeaderboardRankings(paramsDuration);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/leaderboard/get_ranking?addr=sampleAddr&page_size=10&shift=0&duration=string`
    );
    expect(resultDuration).toEqual(mockResponseDuration);
  });

  it("should handle undefined cases in parameters", async () => {
    const mockData = {
      rankings: [
        { address: "0x123abc", xp: 100, achievements: 5 },
        { address: "0x456def", xp: 80, achievements: 3 },
        { address: "0x789ghi", xp: 120, achievements: 7 },
      ],
      first_elt_position: 1,
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const params1 = {
      addr: undefined,
      page_size: -1,
      shift: 0,
      duration: "string",
    };
    const result1 = await fetchLeaderboardRankings(params1);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/leaderboard/get_ranking?addr=undefined&page_size=-1&shift=0&duration=string`
    );
    expect(result1).toEqual(mockData);
  });

  it("should handle null cases in parameters", async () => {
    const mockData = {
      rankings: [
        { address: "0x123abc", xp: 100, achievements: 5 },
        { address: "0x456def", xp: 80, achievements: 3 },
        { address: "0x789ghi", xp: 120, achievements: 7 },
      ],
      first_elt_position: 1,
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const params2 = { addr: null, page_size: -1, shift: 0, duration: "string" };
    const result2 = await fetchLeaderboardRankings(params2);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/leaderboard/get_ranking?addr=null&page_size=-1&shift=0&duration=string`
    );
    expect(result2).toEqual(mockData);
  });
});

describe("getBoostById function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should fetch and return data for a valid boost id", async () => {
    const mockData = {
      amount: 1000,
      expiry: 1718052414000,
      hidden: false,
      id: 9,
      img_url: "/nostra/cigar.webp",
      name: "nostra - Stake and Win",
      num_of_winners: 4,
      quests: [27],
      token:
        "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
      token_decimals: 18,
      winner: null,
    };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getBoostById("boost-id");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_boost?id=boost-id`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle when API returns no response", async () => {
    const mockData = undefined;
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getBoostById("boost-id");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_boost?id=boost-id`
    );
    expect(result).toBeUndefined();
  });
  it("should handle when API returns response in unexpected format", async () => {
    const mockData = "Unexpected response format";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getBoostById("boost-id");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_boost?id=boost-id`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle undefined cases in parameters", async () => {
    const mockData =
      "Failed to deserialize query string: invalid digit found in string";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getBoostById(undefined);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_boost?id=undefined`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle null cases in parameters", async () => {
    const mockData =
      "Failed to deserialize query string: invalid digit found in string";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getBoostById(null);
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/boost/get_boost?id=null`);
    expect(result).toEqual(mockData);
  });

  it("should handle fetch errors gracefully", async () => {
    const mockResponse = "Error while fetching boost data";
    fetch.mockResolvedValueOnce({
      json: () => Promise.reject(mockResponse),
    });
        const result = await getBoostById("invalid-id");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_boost?id=invalid-id`
    );
    expect(result).toBeUndefined();
  });
});

describe("getQuestActivityData function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });
  it("should fetch and return data for a valid id", async () => {
    //mock data for successful response
    const mockData = [{ date: "2024-04-04 04", participants: 2 }];
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });
    const result = await getQuestActivityData(1);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_quest_activity?id=1`
    );
    expect(result).toEqual(mockData);
  });
  it("should handle API returning no response", async () => {
    // Mock fetch response with no data
    const mockResponse = undefined;
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockResponse) });

    const result = await getQuestActivityData("invalidId");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_quest_activity?id=invalidId`
      
       );
    expect(result).toBeUndefined();
  });
  
  
  it("should handle unexpected response format", async () => {
    // Mock fetch response with unexpected data format
    const mockResponse = [];
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockResponse) });
    const result = await getQuestActivityData(10);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_quest_activity?id=10`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should handle null cases in parameters", async () => {
    // mock fetch response with null parameters
    const mockResponse = "Failed to deserialize query string: invalid digit found in string";
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockResponse) });
    const result = await getQuestActivityData("");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_quest_activity?id=`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should handle undefined cases in parameters", async () => {
    // mock fetch response with undefined parameters
    const mockResponse = undefined;
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockResponse) });
    const result = await getQuestActivityData(undefined);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_quest_activity?id=undefined`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should handle fetch errors gracefully", async () => {
    const mockResponse = "Error while fetching quest data";
    
     fetch.mockResolvedValueOnce({
      json: () => Promise.reject(mockResponse),
    });
    
    const result = await getQuestActivityData("invalid-id");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_quest_activity?id=invalid-id`
      
        );
    expect(result).toBeUndefined();
  });
});

describe("getDeployedTimeByAddress function", () => {
  
    beforeEach(() => {
    fetch.mockClear();
  });
  
   it("should fetch and return data for a valid address or domain", async () => {
    const mockData = {
      timestamp: 9843327487
    };
     
      fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });
     
      const result = await getDeployedTimeByAddress("0x02baedbff795949d6aa1ebc0dead2b2ba5d34e97ae1c4aee6cd0796d6ad33b52");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_deployed_time?addr=0x02baedbff795949d6aa1ebc0dead2b2ba5d34e97ae1c4aee6cd0796d6ad33b52`
          );
    expect(result).toEqual(mockData);
  });
  
    it("should handle when API returns no response", async () => {
    const mockData = undefined;
      
      
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });
      
       const result = await getDeployedTimeByAddress("0x02baedbff795949d6aa1ebc0dead2b2ba5d34e97ae1c4aee6cd0796d6ad33b52");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_deployed_time?addr=0x02baedbff795949d6aa1ebc0dead2b2ba5d34e97ae1c4aee6cd0796d6ad33b52`
      
       );
    expect(result).toBeUndefined();
  });
  
    it("should handle undefined cases in parameters", async () => {
    
    const mockData = "Failed to deserialize query string: invalid character";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });
    
     const result = await getTrendingQuests("kasjcaakjhasdajhd");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_trending_quests?addr=kasjcaakjhasdajhd` );
    expect(result).toEqual(mockData);
  });

   it("should handle null cases in parameters", async () => {
    const mockData = "Failed to deserialize query string: invalid character";
     
      fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });
     
      const result = await getDeployedTimeByAddress(null);
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/get_deployed_time?addr=null`);
    expect(result).toEqual(mockData);
  });

  it("should handle fetch errors gracefully", async () => {
    const mockResponse = "Error while fetching deployed time";
    
     fetch.mockResolvedValueOnce({
      json: () => Promise.reject(mockResponse),
    });
    
     const result = await getDeployedTimeByAddress("invalid-address");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_deployed_time?addr=invalid-address`
      
        );
    expect(result).toBeUndefined();
  });
});

   
describe("getUniqueVisitorCount function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });
  it("should return data for valid page id", async () => {
    const mockResponse = 14;
    fetch.mockResolvedValueOnce({json: () => Promise.resolve(mockResponse)})
    const result = await getUniqueVisitorCount(1);
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/analytics/get_unique_visitors?id=1`);
    expect(result).toEqual(mockResponse);
  })
  it("should handle errors gracefully", async () => {
    const mockResponse = "Error while fetching unique visitor count";
    fetch.mockResolvedValueOnce({json: () => Promise.reject(mockResponse)})
    const result = await getUniqueVisitorCount("invalid-id");
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/analytics/get_unique_visitors?id=invalid-id`);
    expect(result).toBeUndefined();
  })
  it("should handle null cases in parameters", async () => {
    const mockResponse = "Failed to deserialize query string: invalid digit found in string";
    fetch.mockResolvedValueOnce({json: () => Promise.resolve(mockResponse)})
    const result = await getUniqueVisitorCount(null);
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/analytics/get_unique_visitors?id=null`);
    expect(result).toEqual(mockResponse);
  })
  it("should handle undefined cases in parameters", async () => {
    const mockResponse =
      "Failed to deserialize query string: invalid digit found in string";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getUniqueVisitorCount(undefined);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_unique_visitors?id=undefined`
    );
    expect(result).toEqual(mockResponse);
  });
  it("should handle when API returns no response", async () => {
    const mockResponse = undefined;
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getUniqueVisitorCount("page-id");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_unique_visitors?id=page-id`
    );
    expect(result).toBeUndefined();
  });
  it("should handle when API returns response in unexpected format", async () => {
    const mockResponse = 0;
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getUniqueVisitorCount(10);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_unique_visitors?id=10`
    );
    expect(result).toEqual(mockResponse);
  });
})



describe("getTrendingQuests function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });
  
  it("should fetch and return data for a valid addr", async () => {
    const mockData = [
      {
        id: 20,
        name: "Nostra - LaFamiglia Rose",
        desc: "Nostra, is a versatile liquidity protocol for lending and borrowing, built on Starknet",
        additional_desc: null,
        issuer: "Nostra",
        category: "deFi",
        rewards_endpoint: "quests/nostra/claimable",
        logo: "/nostra/favicon.ico",
        rewards_img: "/nostra/rose.webp",
        rewards_title: "1 NFT",
        rewards_description: null,
        rewards_nfts: [
          {
            img: "/nostra/rose.webp",
            level: 1,
          },
        ],
        img_card: "/nostra/rose.webp",
        title_card: "Nostra - LaFamiglia Rose",
        hidden: false,
        disabled: false,
        expiry: null,
        expiry_timestamp: null,
        mandatory_domain: "root",
        expired: false,
        experience: 10,
      },
    ];
     fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });
    
     const result = await getTrendingQuests("1145");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_trending_quests?addr=1145`
          );
    expect(result).toEqual(mockData);
  });
  
    it("should handle when API returns empty array", async () => {
    const mockData = [];
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });
      
       const result = await getTrendingQuests("1145");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_trending_quests?addr=1145`
    );
    expect(result).toHaveLength(0);
  });

  it("should handle when wrong address given in parameters", async () => {
    const mockData = "Failed to deserialize query string: invalid character";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });
    
    const result = await getTrendingQuests("kasjcaakjhasdajhd");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_trending_quests?addr=kasjcaakjhasdajhd`
    );
    expect(result).toEqual(mockData);
  });
  
    it("should handle undefined cases in parameters", async () => {
    const mockData = [];
       fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });
      
       const result = await getTrendingQuests();
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/get_trending_quests`);
    expect(result).toHaveLength(0);
  });

  it("should handle null cases in parameters", async () => {
    const mockData = [];
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getTrendingQuests(null);
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/get_trending_quests`);
    expect(result).toHaveLength(0);
  });
});

describe("getQuizById function", () => {
  
    beforeEach(() => {
    fetch.mockClear();
  });
  
    it("should fetch and return data for a valid quiz id", async () => {
    const mockData = {
      name: "Nostra Quiz",
      desc: "Take part in our Quiz to test your knowledge about Nostra, and you'll have a chance to win an exclusive LaFamiglia Rose NFT as your reward.",
      questions: [
        {
          kind: "text_choice",
          layout: "default",
          question: "Which network is Nostra built on?",
          options: ["Scroll", "Starknet", "Binance Smart Chain", "zkSync"],
          image_for_layout: null,
        },
        {
          kind: "text_choice",
          layout: "default",
          question: "How many sub-accounts can a user open on Nostra?",
          options: ["10", "100", "255", "Unlimited"],
          image_for_layout: null,
        },
        {
          kind: "text_choice",
          layout: "default",
          question: "What is the minimum borrow amount for USDC on Nostra?",
          options: [
            "500 USDC",
            "100 USDC.",
            "3000 USDC.",
            "There is no minimum amount",
          ],
          image_for_layout: null,
        },
      ],
    };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getQuizById("nostra");
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/get_quiz?id=nostra&addr=0`);
    expect(result).toEqual(mockData);
  });

  it("should handle when API returns no response", async () => {
    const mockData = undefined;
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getQuizById("nostra");
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/get_quiz?id=nostra&addr=0`);
    expect(result).toBeUndefined();
  });

  it("should handle undefined cases in parameters", async () => {
    const mockData = "Failed to deserialize query string: invalid character";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getQuizById(undefined);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_quiz?id=undefined&addr=0`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle null cases in parameters", async () => {
    const mockData = "Failed to deserialize query string: invalid character";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getQuizById(null, null);
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/get_quiz?id=null&addr=null`);
    expect(result).toEqual(mockData);
  });

  it("should handle fetch errors gracefully", async () => {
    const mockResponse = "Quiz not found";
    fetch.mockResolvedValueOnce({
      json: () => Promise.reject(mockResponse),
    });

    const result = await getQuizById("invalid-id");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_quiz?id=invalid-id&addr=0`
    );
    expect(result).toBeUndefined();
      });
});


describe("getQuestsInBoost function", () => {
  
    it("should handle unexpected params format", async () => {
    const mockResponse = "Failed to deserialize query string: invalid digit found in string";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    })

    const result = await getQuestsInBoost('my-test-id');

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_quests?boost_id=my-test-id`
    );

    expect(result).toEqual(mockResponse)
  });

  it("should handle empty params", async () => {
    const mockResponse = "Failed to deserialize query string: cannot parse integer from empty string";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    })

    const result = await getQuestsInBoost('');

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_quests?boost_id=`
    );

    expect(result).toEqual(mockResponse)
  });
  
  it("should handle no quests in boost", async () => {
    const mockResponse = [];
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    })

    const result = await getQuestsInBoost('444');

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_quests?boost_id=444`
    );

    expect(result).toEqual(mockResponse);
  });

  it("should fetch and return data for a valid boost id", async () => {
    const mockResponse = [
      {
        "id": 78,
        "name": "Ethereal Odyssey - Crossroads of Ether",
        "desc": "Embark on an ethereal journey through the Crossroads of Ether, where the boundaries between realms blur.",
        "additional_desc": "Unravel mysteries and forge alliances in this mystical quest.",
        "issuer": "Ethereal Ventures",
        "category": "Fantasy",
        "rewards_endpoint": "quests/ethereal/claimable",
        "logo": "/ethereal/favicon.ico",
        "rewards_img": "/ethereal/ether_crossroads.webp",
        "rewards_title": "Ethereal Amulet",
        "rewards_description": "Obtain a powerful Ethereal Amulet upon completion.",
        "rewards_nfts": [
          {
            "img": "/ethereal/ether_crossroads.webp",
            "level": 5
          }
        ],
        "img_card": "/ethereal/ether_crossroads.webp",
        "title_card": "Ethereal Odyssey - Crossroads of Ether",
        "hidden": false,
        "disabled": false,
        "expiry": 1794553600000,
        "expiry_timestamp": null,
        "mandatory_domain": "ethereal",
        "expired": false,
        "experience": 25,
        "start_time": 1687862400000
      }
  ];
    
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    })

    const result = await getQuestsInBoost('13');

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_quests?boost_id=13`
    );
    expect(result).toEqual(mockResponse)
      });
});
