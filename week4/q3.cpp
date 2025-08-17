// Partition Equal Subset Sum

//Approach 1: recursion and memorisation
// time complexity = O(n + 2^n)
// space complexity = O(1)

class Solution {
public:
    bool func(vector<int>&nums,int target,int i){
        if(target==0) return true;
        if(i>=nums.size() || target<0) return false;
        return func(nums,target-nums[i],i+1) || func(nums,target,i+1);
    }
    bool canPartition(vector<int>& nums) {
        int s=accumulate(nums.begin(),nums.end(),0);
        if(s%2!=0) return false;
        return func(nums,s/2,0);
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
