# SVG Optimize — Agent Instructions

## 站点资产（必读，先于本文件其余内容）

本站的**计划、每日监控、数据快照、关键词研究、竞品跟踪、事故记录**都在 Obsidian vault 里，
不在本仓库。本仓库只有代码。

- **相对路径**：`🛜 WebSIteBusiness/Websites/SVG-optimize/`
- **根路径运行时解析** —— vault 在不同主机上位置不同（`~/code/ObsidianNote`、
  `~/Documents/Obsidian`、云端 sandbox 的 `/home/user/sessions/<id>/...`），
  **任何文档和脚本里都不许写死绝对路径**：

  ```bash
  OBSIDIAN_VAULT="${OBSIDIAN_VAULT:-$HOME/code/ObsidianNote}"
  SITE_DOCS="$OBSIDIAN_VAULT/🛜 WebSIteBusiness/Websites/SVG-optimize"
  [ -d "$SITE_DOCS" ] || echo "站点资产目录不存在: $SITE_DOCS"
  ```

- **入口文档**：`$SITE_DOCS/站点信息.md`（一级信息：仓库、本机目录、产品定位、阶段）
- **规范**：`$OBSIDIAN_VAULT/🛜 WebSIteBusiness/BuildingTools/站点信息规范.md`

**动手改这个站之前，先读入口文档。** 读之前先过门禁：

```bash
sh "$OBSIDIAN_VAULT/🛜 WebSIteBusiness/BuildingTools/pull-vault.sh" || exit 1
```

非 0 退出就停下 —— vault 在多台设备间同步，**基于过期文档做判断比 git 冲突更贵**：
计划日期被改过、基线数字更新过、某个方向已被否决，而这边还按旧版执行。这类错误不报错。

**入口文档（读之前先过上面的门禁）**：`$SITE_DOCS/站点信息.md`。
那里的计划、基线数字和"判死"清单一律比本文件新，而且它们是判断"这个改动该不该做"的依据。

**反过来也成立**：凡是影响长期判断的结论 —— 关键词否决、索引异常、数据口径变化、
踩过的坑 —— **写回 Obsidian，不要只留在对话里**。对话会滚走，文档不会。

---

## 项目

Next.js 项目。构建与开发命令见 `README.md`。
