//Problem: Find the Majority Element
// approach : first sort the array then return the n/2th element as it must have n/2 frequency
// timecomplexity : O(nlog(n))
// space complexity : O(1)
class Solution {
public:
    int majorityElement(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        int n = nums.size();
        return nums[n/2];
    }
};
// approach : update count with every max frequency through the iteration and atlast count element will always be the answer 
// time complexity : O(N)
// space complexity : O(1)
class Solution {
public:
    int majorityElement(vector<int>& nums) {
        int c=0;
        int j=0;
        for(int i : nums){
            if(c==0){
                j=i;
            }if(j==i){
                c++;
            }else{
                c--;
            }
        }return j;
    }
};
