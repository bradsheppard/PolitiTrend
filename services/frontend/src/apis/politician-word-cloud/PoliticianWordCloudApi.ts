import { url } from '../Utils';
import axios, { AxiosInstance } from 'axios';
import SearchPoliticianWordCloudDto from '../politician-word-cloud/SearchPoliticianWordCloudDto';
import PoliticianWordCloudDto from '../politician-word-cloud/PoliticianWordCloudDto';

class PoliticianWordCloudApi {

    private static url = `http://${url}/api/politicianwordclouds`;

    static async get(searchWordCloudDto?: SearchPoliticianWordCloudDto): Promise<PoliticianWordCloudDto[]> {
        const axiosInstance = this.createAxiosInstance();
        const res = await axiosInstance.get<PoliticianWordCloudDto[]>('', {params: searchWordCloudDto});
        return res.data;
    }

    private static createAxiosInstance(): AxiosInstance {
        return axios.create({baseURL: this.url});
    }
}

export default PoliticianWordCloudApi;
