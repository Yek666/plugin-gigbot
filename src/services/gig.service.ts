import { Gig } from "../types";

export class GigService {
  static apiUrl = 'https://www.gigbot.xyz/api';

  async claimRewards(castUrl: string): Promise<boolean> {
    const res = await fetch(`${GigService.apiUrl}/claim`, {
      method: 'POST',
      body: JSON.stringify({ url: castUrl }),
    });

    if (!res.ok) {
      console.error('Failed to claim rewards', { res });
      return false;
    }

    const data = (await res.json()) as {
      summary: {
        success_count: number;
      };
    };
    return data.summary.success_count > 0;
  }

  async getGigs(): Promise<Gig[]> {
    const res = await fetch(`${GigService.apiUrl}/gigs?status=active`);
    const data = (await res.json()) as {
      gigs: Gig[];
    };
    return data.gigs;
  }
}

export const gigService = new GigService();
