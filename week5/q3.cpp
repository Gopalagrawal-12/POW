     //Flood Fill Algorithm

//Approach by dfs
// time complexity = O(n)
// space complexity = O(n) because of recursive space

class Solution {
public:
    void flood(vector<vector<int>>& image, int sr, int sc, int color,int x){
        if(sr<0 || sr>=image.size() || sc<0 || sc >= image[0].size() || image[sr][sc]!=x) return;
        image[sr][sc]=color;
        flood(image,sr+1,sc,color,x);
        flood(image,sr-1,sc,color,x);
        flood(image,sr,sc+1,color,x);
        flood(image,sr,sc-1,color,x);

    }
    vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {
        int x=image[sr][sc];
        if(x==color) return image;
        flood(image,sr,sc,color,x);
        return image;
    }
};
