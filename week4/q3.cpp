// Partition Equal Subset Sum

//Approach 1: recursion and memorisation
// time complexity = O(n + n*(sum of array/2)
// space complexity = O(n*sum of array/2)

class Solution {
public:
    bool func(vector<int>&nums,int target,int i,vector<vector<int>>&memo){
        if(target==0) return true;
        if(i>=nums.size() || target<0) return false;
        if (memo[i][target] != -1) return memo[i][target];
        return memo[i][target]=func(nums,target-nums[i],i+1,memo) || func(nums,target,i+1,memo);
    }
    bool canPartition(vector<int>& nums) {
        int s=accumulate(nums.begin(),nums.end(),0);
        if(s%2!=0) return false;
        vector<vector<int>> memo(nums.size(), vector<int>((s/2)+1, -1));
        return func(nums,s/2,0,memo);
    }
};

//Approach 2 : by bit manipulation : stores all possible sum in one bitset
// time complexity : O(n* sum/2)
// space complexity : O(sum/2) : one bitset of maximum target
class Solution {
public:
    
    bool canPartition(vector<int>& nums) {
        int s=accumulate(nums.begin(),nums.end(),0);
        if(s%2!=0) return false;
        int target=s/2;
        bitset<10001> bits(1);
        for(auto i :nums){
            bits |= bits << i;
        }return bits[target];
    }
};
