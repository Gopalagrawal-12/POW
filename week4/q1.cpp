// Count Unival Subtrees

// Approach by dfs stack method in which i traverse to all elements from bottom to top
// time complexity : O(n)
// space complexity : O(n) because of recursive approach

class Solution{
private:
  int count=0;
public :
  bool func(TreeNode* node){
    if(node==NULL) return true;
    bool left=func(node->left);
    bool right=func(node->right);
    if(left && right){
      if((node->left!=NULL && node->left->val!=node->val) || (node->right!=NULL && node->right->val!=node->val)){
        return false;
      }count++;
      return true;
    }return false;
  }
  int count_unival(TreeNode* root){
    func(root);
    return count;
  }
};
