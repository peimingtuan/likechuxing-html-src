/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: BranchActions
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/29-下午2:31
 Description:
 Param:
 Return:
 *************************************************/
import Reflux from 'reflux'

export default Reflux.createActions([
    'getBranches',
    'searchBranches',
    'changeActiveBranch',
    // 变更branchList中的页码
    'changeBranchListPage',


])